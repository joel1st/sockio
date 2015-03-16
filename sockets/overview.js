"use strict";
module.exports = function(io){
	var fastChat = io.of('/overview-chat');
	fastChat.on('connection', function(socket){
	    console.log('connection made!');
	    
	    //fastChat.emit('msg', 'a specific message to a specific person');
	    socket.on('msg', function(data){
	        fastChat.emit('msg', data);
	    });

	    socket.on('disconnect', function(){
	    	console.log('a client disconnected');
	    });
	});
};