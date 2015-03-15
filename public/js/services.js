"use strict";
chatApp.factory('retrievePastMessages', ["$routeParams", function($routeParams) {
	return; 
}]);

chatApp.factory('Socket', [function() {
	var Socket = function(namespace, room, scope){
		this.socket = io.connect(":3000/"+namespace);
		this.room = room;
		this.scope = scope;
		this.emit('join-room', 'Joely')
	}
	Socket.prototype.emit = function(emit, msg){
		var data = {msg: msg, room: this.room}
		this.socket.emit(emit, data);
	};
	Socket.prototype.on = function(type, callback){
		this.socket.on(type, function(data){
			this.scope.$apply(function(){
				callback(data);
			})
		}.bind(this));
	};
	Socket.prototype.disconnect = function(){
		console.log('disconnect');
		this.emit('disconnectMe', this.room);
	};
	return Socket; 
}]);