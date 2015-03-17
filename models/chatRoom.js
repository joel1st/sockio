var mongoose = require('mongoose');
var crypto = require('crypto');

var enforceTitleLength = function(property) {
	return (property && property.length >= 1 && property.length <= 80);
};

var enforceMessageLength = function(property) {
	return (property && property.length >= 1 && property.length <= 500);
};

var enforceUsernameLength = function(property) {
	return (property && property.length >= 1 && property.length <= 15);
};

var enforceValidType = function(property){
	return property === 'public' || property === 'private' || property === 'protected';
};

var ChatRoom = new mongoose.Schema({
	dateAdded : {type: Date, 'default': Date.now},
	dateModified: {type: Date, 'default': Date.now},
	title: {
		type: String,
		trim: true,
		required: true,
		validate: [enforceMessageLength, 'Please stick within 80 characters.']
	},
	roomType: {
		type: String,
		validate: [enforceValidType, 'Please choose a valid room type.'],
		default: 'public'
	},
	salt: String,
	password: String,
	messages: [{
		userName: {
			type: String,
			trim: true,
			required: true,
			validate: [enforceUsernameLength, 'Please stick within 15 characters for your username.']
		},
		userColour: String,
		message: {
			type: String,
			trim: true,
			required: true,
			validate: [enforceMessageLength, 'Please stick within 500 characters.']
		},
		style: String,
		date: {type: Date, 'default': Date.now}
	}]
});

//Set index on actual database rather than schema for production.
ChatRoom.index({'messages.date': -1, dateModified: -1});


// Use mean.js method of hasing passwords. (http://meanjs.org/)
/**
 * Hook a pre save method to hash the password
 */
ChatRoom.pre('save', function(next) {
	if (this.roomType === 'protected' && this.password && this.password.length > 1) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

/**
 * Create instance method for hashing a password
 */
ChatRoom.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
ChatRoom.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

module.exports = mongoose.model('ChatRoom', ChatRoom);