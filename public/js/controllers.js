'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', ['$scope', '$http', 'Groups', function ($scope, $http, Groups) {

		$scope.testing = true

		// mock data for testing layout stuff without bridge
		// will be overwritten by real data if loaded from bridge
		$scope.lights = {
			'1': {
				'name': 'Light 1',
				'state': {
					'hue': 50000,
					'on': true,
					'effect': 'none',
					'alert': 'none',
					'bri': 200,
					'sat': 200,
					'ct': 500,
					'xy': [0.5, 0.5],
					'reachable': true,
					'colormode': 'hs'
				},
				'type': 'Living Colors'
			},
			'2': {
				'name': 'Light 2',
				'state': {
					'hue': 50000,
					'on': true,
					'effect': 'none',
					'alert': 'none',
					'bri': 200,
					'sat': 200,
					'ct': 500,
					'xy': [0.5, 0.5],
					'reachable': true,
					'colormode': 'hs'
				},
				'type': 'Living Colors'
			},
			'3': {
				'name': 'Light 3',
				'state': {
					'hue': 50000,
					'on': true,
					'effect': 'none',
					'alert': 'none',
					'bri': 200,
					'sat': 200,
					'ct': 500,
					'xy': [0.5, 0.5],
					'reachable': true,
					'colormode': 'hs'
				},
				'type': 'Living Colors'
			}
		}
		$scope.connectIP = ''
		$scope.hueIP = 'Finding...'
		$scope.groups = Groups.groups
		$scope.presets = Object.keys(Groups.presets)

		$scope.assignedLightKeys = function(){
			// this takes each group's lights, gets the keys of each assigned light,
			// then returns an aggregated array of all the assigned lights
			return _.reduce(Groups.groups, function(a, group){
					return a.concat(_.filter(group.lights, function(val){ return val }))
				}, [])
		}

		$scope.availableLights = function(passlightID){
		// passing a lightID to this function allows that light to pass the filter
		// and remain in the returned array (used for generating option for select dropdowns)
			var assignedKeys = $scope.assignedLightKeys(),
				availableLights = {}

			_.forEach($scope.lights, function(light, key){
				if(!_.contains(assignedKeys, key) || key === passlightID){
					availableLights[key] = light
				}
			})

			return availableLights
		}

		$scope.selectLights = function(passlightID){
		// need to use this wrapper on available lights so I can
		// pass the lights ID as a property rather than the key,
		// because apparently ngoptions doesn't allow using the key as
		// the option value, at least as far as my googling can tell...
			return _.map($scope.availableLights(passlightID), function(light, key){ return {name: light.name, value: key} })
		}

		$scope.onSelectedLight = function(position){
			console.log($scope.groups)
		}

		$scope.onSelectedPreset = function(position){
			console.log($scope.groups)
		}

		$scope.toggleLight = function(lightID) {
			console.log(lightID)
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

		$scope.usePreset = function(light, preset){
			var settings = Groups.presets[preset]
			_.assign($scope.lights[light].state, settings)
			console.log('updated light')
		}

		$scope.loadLights = function(){
			if(navigator.onLine) { // hey, that's cool, didn't know it existed!
				$.get('http://www.meethue.com/api/nupnp', function(result, textStatus){
					if(textStatus === 'success' && result.length > 0) {
						$scope.hueIP = result[0].internalipaddress;
						$.get('http://' + $scope.hueIP + '/api/newdeveloper', function(result, status) {
							if(status === 'success') {
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

		$scope.addGroup = function(){
			Groups.addGroup('New Group', function(name){
				console.log('group added: ', name)
			})
		}
	}])