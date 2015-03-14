"use strict";
var chatApp = angular.module('chatApp', ["ngRoute"]);

chatApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { templateUrl: 'templates/chat-rooms.html', controller: "ChatRoomsCtrl" }).
		when('/room/:id', { templateUrl: 'templates/chat-room.html', controller: "ChatRoomCtrl" }).
		when('/create-room', { templateUrl: 'templates/create-room.html', controller: "CreateRoomCtrl" }).
		when('/login-or-register', { templateUrl: 'templates/login-or-register.html', controller: "LoginOrRegisterCtrl" }).

		otherwise({ redirectTo: '/' });
}]);
	