"use strict";
var chatApp = angular.module('chatApp', ["ngRoute"]);

chatApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { templateUrl: 'templates/create-room.html', controller: "CreateRoomCtrl" }).
		when('/room/:id', { templateUrl: 'templates/chat-room.html', controller: "ChatRoomCtrl" }).
		otherwise({ redirectTo: '/' });
}]);
	