'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		// $scope.findHue = function(){
		// 	getHueIP();
		// };

		// $scope.lightOn = function(){
		// 	toggleLight();
		// }

		// $scope.getLight = function(){
		// 	infoLight();
		// }

		$scope.lights = {}
		$scope.connectIP = ''

		$scope.toggleLight = function(lightID) {
			$scope.lights[lightID].state.on = !$scope.lights[lightID].state.on
			console.log($scope.lights[lightID].state.on)
			$.ajax({
			    url: 'http://' + $scope.connectIP + '/api/newdeveloper/lights/' + lightID + '/state',
			    data : JSON.stringify({'on': $scope.lights[lightID].state.on}),
			    type: 'PUT',
				success: function(result) {
					console.log('change sent', result)
			    }
			});
		}

		$scope.loadLights = function(){
			$.get("http://www.meethue.com/api/nupnp", function(result, textStatus){
			    	if(textStatus = "success") {
			    		$scope.connectIP = result[0].internalipaddress;
			    		console.log("Hue Bridge Found: " + $scope.connectIP);
			    	}
			    	else {
			    		console.log("No Hue Bridge is identified");
			    	}
			    }).done(function(){
			    	$.get("http://" + $scope.connectIP + "/api/newdeveloper", function(result, status) {
						if(status == "success") {
							$scope.$apply(function(){
								$scope.lights = result.lights	
							})
							
							// for(var i in result.lights) {
							// 	$('#lightMenu').append('<li>' + result.lights[i].name + '<br>' + 
							// 		'<button id=' + i + ' onclick="buttonClick(this.id)">  ' + result.lights[i].state.on + '</button><br>' +
							// 		'<input type="range" id=' + i + 'slider min=0 max=255 step=1 onmouseup="sliderMove(this.id, this.value)"></input>' + 
							// 		'<input type="color" id=' + i + 'color onchange="colorChange(this.id, value)"></input></li>');
							// }
						}
					});
			    });

			
		}

		$scope.loadLights()
	})