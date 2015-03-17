var ChatRoom = require("../../models/chatRoom");
"use strict";
module.exports = function(regular, io){
 	return {
 		authenticateUser: function(socket, data, callback){
			if (socket.roomId){
		        callback(data);
		    } else { 
				ChatRoom.findOne({_id: data.room}, function(err, doc){
					if(err || !doc){
						socket.emit('roomInfo', true);
					} else {
						if (doc.roomType !== 'private'){
							socket.roomId = data.room;
							socket.join(data.room);
							callback(data, doc);
						}
					}
				});
			}
		},

		newMessage: function(roomId, messageObj){
			ChatRoom.findByIdAndUpdate({_id: roomId}, {
                dateModified: Date.now(),
                $addToSet: { messages: messageObj}
            }, {
                "new": true
            }, function(err, data) {
            	if(!err){
            		regular.to(roomId).emit('msg', data.messages[data.messages.length-1]);
            	}  
            });
		},

		rooms: {},

		newUser: function(socket, roomId, sessionId, session){
			if(!Object.prototype.hasOwnProperty.call(this.rooms, roomId)){
				this.rooms[roomId] = [];
			}
			this.add(socket, roomId, sessionId, session);
		},

		removeUser: function(socket, roomId, sessionId){
			if(Object.prototype.hasOwnProperty.call(this.rooms, roomId)){
				this.remove(socket, roomId, sessionId);
			} 
		},

		indexOfUser: function(userArray, sessionId){
			for(var i = 0; i < userArray.length; i++){
				if (userArray[i].sessionId === sessionId){
					return i;
				} 
			};
			return -1;
		},

		activeUsers: function(userArray){
			var newArr = [];
			for(var i = 0; i < userArray.length; i++){
				newArr.push(userArray[i].userInfo);
			};
			return newArr;
		},

		add: function(socket, roomId, sessionId, userObj){
			var userArray = this.rooms[roomId];
			
			var userIndex = this.indexOfUser(userArray, sessionId);
			
			if (userIndex === -1){
				userArray.push({
					sessionId: sessionId,
					userInfo: {
						userColour: userObj.colour,
						userName: userObj.userName,
						userJoined: Date.now()
					},
					connections: 1
				});
				socket.broadcast.to(roomId).emit('newUser', userArray[userArray.length-1].userInfo);
				this.newMessage(roomId, {
					userName: userObj.userName,
					userColour: userObj.colour,
					message: "Joined the chat.",
					style: "new-user"
				});

			} else {
				userArray[userIndex].connections++;
			} 
			socket.emit('newUser', this.activeUsers(userArray));
		},

		remove: function(socket, roomId, sessionId){
			var userArray = this.rooms[roomId];
			var userIndex = this.indexOfUser(userArray, sessionId);
			if (userIndex > -1){
				userArray[userIndex].connections--;
				if (userArray[userIndex].connections < 1){

					var info = userArray[userIndex].userInfo;
					this.newMessage(roomId, {
						userName: info.userName,
						userColour: info.userColour,
						message: "Left the chat.",
						style: "left-user"
					});

					userArray.splice(userIndex, 1);
					socket.broadcast.to(roomId).emit('removeUser', userIndex);
				} 
			}
		}	
	};
};