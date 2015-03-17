"use strict";

/* Controller used to show most active rooms. */
chatApp.controller('ActiveRoomsCtrl', ["$scope", "$location", "Socket", function($scope, $location, Socket){
	$scope.rooms = [];
	var sock = new Socket('overview', null, $scope);

	sock.on('recentChats', function(data){
		$scope.rooms = data;
	});
}]);

/* Controller used for chat rooms. */
chatApp.controller('ChatRoomCtrl', ["$scope", "$routeParams", "Socket", function($scope, $routeParams, Socket){
	var sock = new Socket('regular-chat', $routeParams.id, $scope);
	
	$scope.status = sock.status;
	$scope.messages = []; 
	$scope.users = [];
	$scope.room = {};

	$scope.chat = {
		maxLength:450,
		validLength: true,
		entered: 1, //number of lines for text input area
		message: "",
		submitMsg: function(){
			if(this.message.length && this.message.length <= this.maxLength){
				sock.emit('msg', this.message);
				$scope.chat.message = "";
				$scope.chat.entered = 1;
			}
		},
	};

	/* If the message sent is an array replace 
	the original messages array otherwise push it. */
	sock.on('msg', function(data){	
		if (Array.isArray(data)){ 
			$scope.messages = data;
		} else {
			$scope.messages.push(data);
		}
	});
	
	sock.on('newUser', function(data){	
		if (Array.isArray(data)){
			$scope.users = data;
		} else {
			$scope.users.push(data);
		}
	});

	sock.on('removeUser', function(ind){	
		$scope.users.splice(ind, 1);
	});

	sock.on('roomInfo', function(data){	
		if (typeof data === 'boolean'){
			$scope.room.notFound = data;
		} else {
			$scope.room.title = data;
		}
	});

	/* Generate validLength boolean depending on chat.message */
	$scope.$watch('chat.message', function(){
		$scope.chat.validLength = ($scope.chat.message.length <= $scope.chat.maxLength);
	});

	/* When user changes routes, manually disconnect socket or otherwise connections can stay open */
	$scope.$on('$locationChangeStart', function(){
		sock.disconnect();
	});
}]);

/* Create room */
chatApp.controller('CreateRoomCtrl', ["$scope", "$http", "$location", "Socket", function($scope, $http, $location, Socket){
	$scope.room = {
		roomType: 'public',
		validLength: true,
		maxLength: 50,
		title:''
	};
	$scope.$watch('room.title', function(){
		$scope.room.validLength = ($scope.room.title.length <= $scope.room.maxLength);
	});
	$scope.submitRoom = function(){
		if($scope.room.title && $scope.room.validLength){
			$http.post('/createRoom', $scope.room).
			  success(function(data, status, headers, config) {
			    $location.path('/room/'+data);
			  }).
			  error(function(data, status, headers, config) {
			});
		}
	};
}]);

/* Update guest name */
chatApp.controller('GuestNameCtrl', ["$scope", "$http", "$window", function($scope, $http, $window){
	/* Determine whether a name has already been set or not from session data placed into chatIoData variable */
	$scope.user = {
		nameSet : chatIoData.set || false,
		name : chatIoData.name,
		validLength: true,
		maxLength:15
	};
	$scope.$watch('user.name', function(){
		$scope.user.validLength = ($scope.user.name.length <= $scope.user.maxLength);
	});
	$scope.update = function(){
		if($scope.user.name && $scope.user.validLength){
			$http.post('/changeUser', {name: $scope.user.name}).
			  success(function(data, status, headers, config) {
			    $scope.userNameSet = true;
			    $window.location.reload();
			  }).
			  error(function(data, status, headers, config) {
			});
		}
	};
	
}]);