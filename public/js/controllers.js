"use strict";
chatApp.controller('ChatRoomsCtrl', ["$scope", "Socket", function($scope, Socket){
	var sock = new Socket('fast-chat');
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

chatApp.controller('GuestNameCtrl', ["$scope", function($scope){
	$scope.guestName = 'joel';
}]);