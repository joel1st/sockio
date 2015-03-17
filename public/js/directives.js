"use strict";
	/*  Directive to determine/set the height of the message box and 
	ensure it keeps scrolled to the bottom on new messages */
chatApp.directive('messageBox', ["$window", function($window){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
			/* Sets height of div, and updates it on window change */
			function setCorrectHeight(){
				var headerHeight = angular.element(document.getElementsByTagName('header'))[0].offsetHeight;
				var currentWindowHeight = $window.innerHeight;
				var currentWindowWidth = $window.innerWidth;
				element.css({
					height: currentWindowHeight - headerHeight - 60 + 'px'
				});
			}
			setCorrectHeight(); 	
			var w = angular.element($window);
			w.bind('resize', setCorrectHeight);

			/* Keeps div scrolled to the bottom */
			var objDiv = document.getElementById(attr.id);
			var scrollHeight = objDiv.scrollHeight;
			setInterval(function(){
				if(scrollHeight !== objDiv.scrollHeight){
					scrollHeight = objDiv.scrollHeight;
					objDiv.scrollTop = scrollHeight;
				}
			}, 70);		
		}
	}; 
}]);

/*Used to determine when to submit a message - when enter is pressed by itself */
chatApp.directive('determineSpace', function(){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
			var keysHeld = {13: false, 16: false};

			/* Allows user to press shift enter */
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

		    /* Submits message when enter is pressed */
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