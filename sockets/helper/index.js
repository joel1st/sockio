var ChatRoom = require("../../models/chatRoom");
"use strict";
module.exports = function(regular, io){
 	return {
 		/* Checks to see if the user is in a valid room. Future imrpovements would be to check session data
 		and see that they have been approved (for private rooms). */
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

		/* Update the database and then emit to the room */
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

		/* Check if the room has been visited before and then call add function */
		newUser: function(socket, roomId, sessionId, session){
			if(!Object.prototype.hasOwnProperty.call(this.rooms, roomId)){
				this.rooms[roomId] = [];
			}
			this.add(socket, roomId, sessionId, session);
		},

		/* Check if the room has been visited before (in case of db.drop) and then call remove function */
		removeUser: function(socket, roomId, sessionId){
			if(Object.prototype.hasOwnProperty.call(this.rooms, roomId)){
				this.remove(socket, roomId, sessionId);
			} 
		},

		/* Check to see if user has multiple session instances of the same room (User opens up multiple pages
		of the same chat room). If this is their first time visiting the page emit to the room that a new
		person has joined, otherwise don't emit anything. If the user has multiple sessions open, record it.
		Also sends list of current online users to the new user */
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
				userArray[userIndex].connections++; //increase instances of session open
			} 
			socket.emit('newUser', this.activeUsers(userArray));
		},

		/* Check to see if user has multiple session instances of the same room. If this is their only session
		emit an index to the room so that angular can remove the index. If the user has multiple sessions open, 
		don't emit that a user has left the room. */
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
		},

		/* Determine if the user has multiple instances of the chat session open. If they do, return the index */
		indexOfUser: function(userArray, sessionId){
			for(var i = 0; i < userArray.length; i++){
				if (userArray[i].sessionId === sessionId){
					return i;
				} 
			};
			return -1;
		},

		/* Returns an array of only relevant user information for angular */
		activeUsers: function(userArray){
			var newArr = [];
			for(var i = 0; i < userArray.length; i++){
				newArr.push(userArray[i].userInfo);
			};
			return newArr;
		}
	};
};