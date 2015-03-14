"use strict";
chatApp.controller('CreateRoomCtrl', ["$scope", "Socket", function($scope, Socket){
	var sock = new Socket('overview-chat');
	$scope.messages = [];

	sock.on('msg', function(data){
		$scope.$apply(function(){
			$scope.messages.push(data);
		});
		console.log(data)
	});

	$scope.submitMsg = function(){
		sock.emit('msg', $scope.sendMessage);
		$scope.sendMessage = "";
	};
}]);

chatApp.controller('ChatRoomCtrl', ["$scope", "$routeParams", "Socket", function($scope, $routeParams, Socket){
	var sock = new Socket('fast-chat');
	$scope.messages = [];
	$scope.roomId = $routeParams.id;

	sock.on('msg', function(data){
		$scope.$apply(function(){
			$scope.messages.push(data);
		});
		console.log(data)
	});

	$scope.submitMsg = function(){
		sock.emit('msg', $scope.sendMessage);
		$scope.sendMessage = "";
	};
}]);

chatApp.controller('GuestNameCtrl', ["$scope", function($scope){
	$scope.guestName = 'joel';
}]);