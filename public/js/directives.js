"use strict";
chatApp.directive('messageBox', ["$window", function($window){
	return{
		restrict: 'A',
		link: function(scope, element, attr){
		
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
		            //document.getElementsByClassName('messages').scrollTop = 10000;
		            keysHeld[event.keyCode] = false;
		        }
		    });
		}
	}; 
});