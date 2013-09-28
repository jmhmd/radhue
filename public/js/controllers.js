'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$scope.findHue = function(){
			/*$http.get('http://www.meethue.com/api/nupnp')
				.success(function(result){
					console.log(result)
					$scope.output = result
				})*/
			connectHueNewIp()
		}

	})