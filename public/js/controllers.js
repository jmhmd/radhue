'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$scope.testing = true

		$scope.lights = {
			"1": {
				"name": "Bedroom",
				"state": {
					"hue": 50000,
					"on": true,
					"effect": "none",
					"alert": "none",
					"bri": 200,
					"sat": 200,
					"ct": 500,
					"xy": [0.5, 0.5],
					"reachable": true,
					"colormode": "hs"
				},
				"type": "Living Colors"
			},
			"2": {
				"name": "Kitchen",
				"state": {
					"hue": 50000,
					"on": true,
					"effect": "none",
					"alert": "none",
					"bri": 200,
					"sat": 200,
					"ct": 500,
					"xy": [0.5, 0.5],
					"reachable": true,
					"colormode": "hs"
				},
				"type": "Living Colors"
				}
		}
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
			    	if(result.length > 0) {
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
						} else {
							console.log('error!')
						}
					});
			    });

			
		}

		$scope.loadLights()
	})