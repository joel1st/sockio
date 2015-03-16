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
	    		socket.emit('roomInfo', doc.title);
	    		socket.emit('msg', doc.messages) //sends all messages when user first enters a room.

	    		// regular.to(socket.roomId).emit('userChange', "there is a new kid on the block"+Math.random());
	    		helper.newUser(socket, socket.roomId, sessionId, session);
	    	});	
	    });
	    
	    /* Check what room user belongs to and then broadcast message */
	    socket.on('msg', function(data){
	    	helper.authenticateUser(socket, data, function(data){
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
