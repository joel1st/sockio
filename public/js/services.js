"use strict";

/* Socket factory which returns a constructor function to use socket.io methods with ease */
chatApp.factory('Socket', function() {
	var port = chatIoData.port || 80;

	var Socket = function(namespace, room, scope){
		/* forceNew set to true as angular can try to use existing connection even though
		you're changed routes */
		this.socket = io.connect(":"+port+"/"+namespace, {forceNew: true}); 

		this.room = room;
		this.scope = scope;
		this.status = {
			online : true
		};

		/* When the user connects (or reconnects) emit join-room to request
		relevant data. */
		this.socket.on('connect', function(){
			if(this.room){
				this.emit('join-room');
			}
			this.applyScope(function(){
				this.status.online = true;
			});
		}.bind(this));

		/* Prompt user that they have disconnected */
		this.socket.on('disconnect', function(){
			this.applyScope(function(){
				this.status.online = false;
			});
		}.bind(this));
	};

	Socket.prototype.emit = function(emit, msg){
		var data = {msg: msg, room: this.room};
		this.socket.emit(emit, data);
	};

	Socket.prototype.on = function(type, callback){
		this.socket.on(type, function(data){
			this.applyScope(function(){
				callback(data);
			});
		}.bind(this));
	};

	/* Custom disconnect event to allow for page change disconnection */
	Socket.prototype.disconnect = function(){
		this.socket.emit('disconnectMe');
	};

	/* applyScope causes scope to be applied to passed callback functions */
	Socket.prototype.applyScope = function(callback){
		this.scope.$apply(callback.bind(this));
	};
	return Socket; 
});