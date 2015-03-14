"use strict";
var chatApp = angular.module('chatApp', ["ngRoute"]);

chatApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { templateUrl: 'templates/create-room.html', controller: "CreateRoomCtrl" }).
		when('/room/:id', { templateUrl: 'templates/chat-room.html', controller: "ChatRoomCtrl" }).
		when('/pollroom/:id', { templateUrl: 'templates/chat-room-chart.html', controller: "PollRoomCtrl" }).
		otherwise({ redirectTo: '/' });
}]);
	