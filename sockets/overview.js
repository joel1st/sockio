"use strict";
var ChatRoom = require("../models/chatRoom");

module.exports = function(io){
	var overview = io.of('/overview');
	var recentChats = [];

	function getMostRecentChats(callback){
		ChatRoom.find({}, {dateModified:1, title:1}).sort({'dateModified': -1}).limit(10).exec(function(err, docs){
			recentChats = docs;
			callback(recentChats);
		});
	}

	setInterval(function(){
		getMostRecentChats(function(data){
			overview.emit('recentChats', data);
		});
	}, 10000);
	
	overview.on('connection', function(socket){
	    console.log('connection made!');
	    if (!recentChats.length){
	    	getMostRecentChats(function(data){
	    		socket.emit('recentChats', data);
	    	});
	    } else {
	    	socket.emit('recentChats', recentChats);
	    }
	    
	});
};
