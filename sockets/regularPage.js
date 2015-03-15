"use strict";
var ChatRoom = require("../models/chatRoom");

module.exports = function(io){

	function authenticateUser(socket, data, callback){
		if (socket.roomId){
	        callback(data);
	    } else { 
			ChatRoom.findOne({_id: data.room}, function(err, doc){
				if(err){
					socket.emit('pageData', false);
				} else if(!doc) {
					socket.emit('pageData', false);
				} else {
					if (doc.roomType !== 'private'){
						socket.roomId = data.room;
						socket.join(data.room);
						if(data.room in onlineCount){
							onlineCount.recent.push('poiwjfaowpifjwaef left');
						} else {

						}
						callback(data, doc);
					}
				}
			});
		}
	}

	var onlineCount = {};

	var fastChat = io.of('/regular-chat');
	fastChat.on('connection', function(socket){

	    console.log('connection made!');

	    /* join room and get recent messages */
	    socket.on('join-room', function(data){
	    	console.log(data);
	    	authenticateUser(socket, data, function(data, doc){
	    		socket.emit('msg', doc.messages)
	    		fastChat.to(socket.roomId).emit('userChange',"there is a new kid on the block"+Math.random());
	    	});	
	    })
	    
	    /* Check what room user belongs to and then broadcast message */
	    socket.on('msg', function(data){
	    	console.log(data);
	    	authenticateUser(socket, data, function(data){

	    		ChatRoom.findByIdAndUpdate({_id: data.room}, {
	                $addToSet: { messages: {
						session: 'Name' + Math.random(),
						message: data.msg,
					}}
	            }, {
	                "new": true
	            }, function(err, data) {
	            	if(!err){
	            		fastChat.to(socket.roomId).emit('msg', data.messages[data.messages.length-1]);
	            		console.log('successfully added')
	            	}    
	            });

	    		
	    	});	
	    });

	    /* Allow angular to disconnect from room when changing rooms */
	    socket.on('disconnectMe', function(){
	    	socket.leave(socket.roomId);
	    	socket.roomId = null;
	    });

	    socket.on('disconnect', function(){
	    	console.log('a client disconnected');
	    });

	});


};
