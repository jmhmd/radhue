'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http, Hue) {

		$scope.hue = Hue.hueObj

		$scope.findHue = function(){
<<<<<<< HEAD
			getHueIP();
		};

		$scope.lightOn = function(){
			toggleLight();
		}

		$scope.infoLight = function(){
			infoLight();
=======
			/*$http.get('http://www.meethue.com/api/nupnp')
				.success(function(result){
					console.log(result)
					$scope.output = result
				})*/
			Hue.connectHueNewIp()
>>>>>>> fb908bee25ab0dfbccd641f39db441b19df8ae7b
		}

	})