'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$scope.lights = {}
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
			if(navigator.onLine) {
				$.get("http://www.meethue.com/api/nupnp", function(result, textStatus){
					if(textStatus == "success" & result[0] != undefined) {
    					$scope.hueIP = result[0].internalipaddress;
				    	$.get("http://" + $scope.hueIP + "/api/newdeveloper", function(result, status) {
							if(status == "success") {
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