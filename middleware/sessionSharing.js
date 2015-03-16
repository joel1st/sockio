//http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x/25618636#25618636

//allow access of session data from socket.io
module.exports = function(sessionMiddleware){
	return function(socket, next){
		sessionMiddleware(socket.request, socket.request.res, next);
	}   
}