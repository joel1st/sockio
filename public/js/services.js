"use strict";
chatApp.factory('retrievePastMessages', ["$resource", function($resource) {
	return; 
}]);

chatApp.factory('Socket', function() {
	var Socket = function(namespace, room){
		this.socket = io.connect(":3000/"+namespace);
		if(room){
			this.socket.emit('join-room', room);
		}
	}
	Socket.prototype.emit = function(emit, msg, callback){
		this.socket.emit(emit, msg);
	};
	Socket.prototype.on = function(type, callback){
		this.socket.on(type, callback);
	};
	Socket.prototype.disconnect = function(){
		this.emit('disconnect', 'disconnect me');
	};
	return Socket; 
});