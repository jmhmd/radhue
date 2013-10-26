'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$scope.testing = true

		// mock data for testing layout stuff without bridge
		// will be overwritten by real data if loaded from bridge
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
		$scope.hueIP = 'Finding...'

		$scope.toggleLight = function(lightID) {
			$scope.lights[lightID].state.on = !$scope.lights[lightID].state.on
			console.log($scope.lights[lightID].state.on)
			$.ajax({
			    url: 'http://' + $scope.hueIP + '/api/newdeveloper/lights/' + lightID + '/state',
			    data : JSON.stringify({'on': $scope.lights[lightID].state.on}),
			    type: 'PUT',
				success: function(result) {
					console.log('change sent', result)
			    }
			});
		}

		$scope.loadLights = function(){
			if(navigator.onLine) { // hey, that's cool, didn't know it existed!
				$.get("http://www.meethue.com/api/nupnp", function(result, textStatus){
					if(textStatus === "success" & result.length > 0) {
    					$scope.hueIP = result[0].internalipaddress;
				    	$.get("http://" + $scope.hueIP + "/api/newdeveloper", function(result, status) {
							if(status === "success") {
								$scope.$apply(function(){
									$scope.lights = result.lights	
								})						
							}
						});
    				}
    				else {
    					$scope.$apply(function() {
    						$scope.hueIP = 'No Hue Identified';
    					});
    				}
				});	
			}
			else {
				connectHueNewIp()
			}
		}

		$scope.loadLights()
	})