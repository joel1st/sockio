"use strict";
chatApp.factory('retrievePastMessages', ["$routeParams", function($routeParams) {
	return; 
}]);

chatApp.factory('Socket', [function() {
	var Socket = function(namespace, room, scope){
		this.socket = io.connect(":3000/"+namespace);
		this.room = room;
		this.scope = scope;
		this.status = {
			online : true
		}

		this.socket.on('connect', function(){
			this.emit('join-room');
			this.applyScope(function(){
				this.status.online = true;
			});
		}.bind(this));

		this.socket.on('disconnect', function(){
			this.applyScope(function(){
				this.status.online = false;
			});
		}.bind(this));
	};

	Socket.prototype.emit = function(emit, msg){
		var data = {msg: msg, room: this.room}
		this.socket.emit(emit, data);
	};

	Socket.prototype.on = function(type, callback){
		this.socket.on(type, function(data){
			this.applyScope(function(){
				callback(data);
			});
		}.bind(this));
	};

	Socket.prototype.disconnect = function(){
		this.emit('disconnectMe', this.room);
	};

	Socket.prototype.applyScope = function(callback){
		this.scope.$apply(callback.bind(this));
	}
	return Socket; 
}]);