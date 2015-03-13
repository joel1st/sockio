"use strict";
var chatApp = angular.module('chatApp', []).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/', { templateUrl: 'templates/chatrooms.html', controller: ChatRooms }).
			otherwise({ redirectTo: '/' });
	}]);
	