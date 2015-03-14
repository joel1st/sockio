"use strict";
var chatApp = angular.module('chatApp', ["ngRoute"]);

chatApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', { templateUrl: 'templates/chat-rooms.html', controller: "ChatRooms" }).
		otherwise({ redirectTo: '/' });
}]);
	