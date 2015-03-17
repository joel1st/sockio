"use strict";
var socketHelper = require('./helper');

module.exports = function(io){
	var regular = io.of('/regular-chat');
	var helper = socketHelper(regular, io);

	regular.on('connection', function(socket){
	    console.log('connection made!');
	    var session = socket.request.session;
	    var sessionId = socket.request.sessionID;

	    /* join room and get recent messages */
	    socket.on('join-room', function(data){
	    	helper.authenticateUser(socket, data, function(data, doc){
	    		/* sends room info */
	    		socket.emit('roomInfo', doc.title);

	    		/* sends all messages when user first enters a room. */
	    		socket.emit('msg', doc.messages); 

	    		/* registers new user in room and determines whether this is their only window open */
	    		helper.newUser(socket, socket.roomId, sessionId, session);
	    	});	
	    });
	    
	    /* Check what room user belongs to and then broadcast message */
	    socket.on('msg', function(data){
	    	helper.authenticateUser(socket, data, function(data){

	    		/* Saves message to database and then emits it */
	    		helper.newMessage(data.room, {
					userName: session.userName,
					userColour: session.colour,
					message: data.msg
				});
	    	});	
	    });

	    /* Allow angular to disconnect from room when changing rooms */
	    socket.on('disconnectMe', function(){
	    	helper.removeUser(socket, socket.roomId, sessionId);
	    	socket.disconnect();
	    });

	    socket.on('disconnect', function(){
	    	helper.removeUser(socket, socket.roomId, sessionId);
	    	console.log('a client disconnected');
	    });

	});


};
