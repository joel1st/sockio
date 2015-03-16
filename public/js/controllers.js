"use strict";
chatApp.controller('CreateRoomCtrl', ["$scope", "$http", "$location", "Socket", function($scope, $http, $location, Socket){
	$scope.room = { //defaults
		roomType: 'public'
	};
	$scope.submitRoom = function(){
		$http.post('/createRoom', $scope.room).
		  success(function(data, status, headers, config) {
		    $location.path('/room/'+data);
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
}]);


chatApp.controller('ActiveRoomsCtrl', ["$scope", "$location", "Socket", function($scope, $location, Socket){
	$scope.rooms = [];
	var sock = new Socket('overview', null, $scope);

	sock.on('recentChats', function(data){
		$scope.rooms = data;
		console.log()
	});
}]);



chatApp.controller('ChatRoomCtrl', ["$scope", "$routeParams", "Socket", function($scope, $routeParams, Socket){
	var sock = new Socket('regular-chat', $routeParams.id, $scope);
	
	$scope.status = sock.status;
	$scope.messages = []; 
	$scope.users = [];
	$scope.room = {};

	$scope.chat = {
		maxLength:450,
		entered: 1, //number of lines for text input area
		message: "",
		submitMsg: function(){
			if($scope.chat.message.length){
				sock.emit('msg', $scope.chat.message);
				$scope.chat.message = "";
				$scope.chat.entered = 1;
			}
		},
	};

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

	$scope.$on('$locationChangeStart', function(){
		sock.disconnect();
	});
}]);

chatApp.controller('GuestNameCtrl', ["$scope", "$http", "$route", function($scope, $http, $route){
	$scope.userNameSet = chatIoData.set || false;
	$scope.userName = chatIoData.name;
	$scope.update = function(){
		$http.post('/changeUser', {name: $scope.userName}).
		  success(function(data, status, headers, config) {
		    $scope.userNameSet = true;
		    $route.reload();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		});
	}
	
}]);