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

chatApp.controller('ChatRoomCtrl', ["$scope", "$routeParams", "Socket", function($scope, $routeParams, Socket){
	var sock = new Socket('regular-chat', $routeParams.id);
	$scope.invalidRoom;
	$scope.messages = []; 
	// sock.on('roomDetails', function(data){
	// 	if(!data){
	// 		$scope.invalidRoom = true;
	// 	}
	// 	$scope.roomInfo = data;
	// });

	sock.on('msg', function(data){
		$scope.$apply(function(){
			if (Array.isArray(data)){
				$scope.messages = data.concat($scope.messages);
			} else {
				$scope.messages.push(data);
			}
		});
	});

	$scope.chat = {
		entered: 1, //number of lines for text input area
		message: "",
		submitMsg: function(){
			console.log('submitsuccessful');
			if($scope.chat.message.length){
				sock.emit('msg', $scope.chat.message);
				$scope.chat.message = "";
				$scope.chat.entered = 1;
			}
		},
		getMore: function(){
			sock.emit('getMore', $scope.messages[0].date);
		}
	};

}]);




chatApp.controller('GuestNameCtrl', ["$scope", function($scope){
	$scope.guestName = 'joel';
}]);