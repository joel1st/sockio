"use strict";
chatApp.factory('retrievePastMessages', ["$resource", function($resource) {
	return; 
}]);

chatApp.factory('Socket', function() {
	var Socket = function(namespace, room){
		this.socket = io.connect(":3000/"+namespace);
		if(room){
			this.room = room;
			this.socket.emit('join-room', room);
		}
	}
	Socket.prototype.emit = function(emit, msg, callback){
		var data = {msg: msg, room: this.room}
		this.socket.emit(emit, data);
	};
	Socket.prototype.on = function(type, callback){
		this.socket.on(type, callback);
	};
	Socket.prototype.disconnect = function(){
		this.emit('leave', this.room);
	};
	return Socket; 
});