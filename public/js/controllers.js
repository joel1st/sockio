"use strict";
chatApp.controller('CreateRoomCtrl', ["$scope", "Socket", function($scope, Socket){

}]);

chatApp.controller('ChatRoomCtrl', ["$scope", "$routeParams", "Socket", function($scope, $routeParams, Socket){
	var sock = new Socket('regular-chat');
	$scope.messages = []; 
	sock.on('msg', function(data){
		console.log('msg recieved')
		$scope.$apply(function(){
			$scope.messages.push(data);
			console.log($scope.messages);
		});
	});

	$scope.chat = {
		entered: 1, //number of lines for text input area
		message: "",
		submitMsg: function(){
			console.log('submitsuccessful');
			sock.emit('msg', $scope.chat.message);
			$scope.$apply(function(){
				$scope.chat.message = "";
				$scope.chat.entered = 1;
			});
		}
	};

}]);




chatApp.controller('GuestNameCtrl', ["$scope", function($scope){
	$scope.guestName = 'joel';
}]);