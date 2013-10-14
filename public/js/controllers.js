'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {

		$scope.findHue = function(){
			getHueIP();
		};

		$scope.lightOn = function(){
			toggleLight();
		}

		$scope.infoLight = function(){
			infoLight();
		}

	})