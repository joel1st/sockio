"use strict";
var ChatRoom = require("../models/chatRoom");

module.exports = function(io){

	var fastChat = io.of('/regular-chat');
	fastChat.on('connection', function(socket){
		var session =  socket.request.session;
		console.log(session + "hi");
		session.userName = 'cowgirl';

		socket.on('join-room', function(data){
			ChatRoom.findOne({_id: data}, function(err, doc){
				if(err){
					socket.emit('pageData', false);
				} else if(!doc) {
					socket.emit('pageData', false);
				} else {
					if (doc.roomType !== 'private'){
						socket.join(data);
					}
				}
			})		
		});

		//.to('some room')

		//fastChat.emit('newUser', )
	    console.log('connection made!');
	    
	    //fastChat.emit('msg', 'a specific message to a specific person');
	    socket.on('msg', function(data){
	        fastChat.emit('msg', data);
	    });
	    socket.on('disconnect-msg', function(){
	    	socket.disconnect();
	    });
	    socket.on('disconnect', function(){
	    	console.log('a client disconnected');
	    });
	});
};
