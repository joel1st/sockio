"use strict";
chatApp.directive('fillHeight', function($window){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
			function setCorrectHeight(){
				var headerHeight = angular.element(document.getElementsByTagName('header'))[0].offsetHeight;
				var currentWindowHeight = $window.innerHeight;
				var currentWindowWidth = $window.innerWidth;
				element.css({
					height: currentWindowHeight - headerHeight + 'px'
				});
			}
			setCorrectHeight(); 

			var w = angular.element($window);
			w.bind('resize', setCorrectHeight);
		}
	}; 
});

chatApp.directive('determineSpace', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
			var keysHeld = {13: false, 16: false};

			element.bind("keydown", function(event) {
		        if (event.which in keysHeld) {
		            keysHeld[event.which] = true;
		            if (keysHeld[13] && keysHeld[16]) {
		            	scope.$apply(function(){
		            		scope.chat.entered++;
		            	});
		            } else if(keysHeld[13]){
		            	event.preventDefault();
		            }
		        }
		    });
		    element.bind("keyup", function(event) {
		        if (event.which in keysHeld) {
		        	if(event.which === 13 && !keysHeld[16]){
		            	scope.chat.submitMsg();
		            }
		            keysHeld[event.keyCode] = false;
		        }
		    });
		}
	}; 
});
