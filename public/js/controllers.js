'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
	controller('AppCtrl', ['$scope', '$http', 'Groups', 'Bridge', function ($scope, $http, Groups, Bridge) {

		$scope.testing = false

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
		$scope.hueIP = Bridge.IP
		$scope.groups = Groups.groups
		$scope.presets = Object.keys(Groups.presets)

		/*
		/-------- Utility functions
		*/
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

		/*
		/-------------- Interface actions
		*/

		$scope.onSelectedLight = function(lightID){
			console.log('light selected')
		}

		$scope.onSelectedPreset = function(groupID){
			// assign selected preset properties to respective group lights
			var preset = Groups.groups[groupID].preset,
				groupLights = Groups.groups[groupID].lights

			console.log('preset selected: ', preset)
			if (preset){
				_.forEach(groupLights, function(lightID, role){
					if (lightID){
						$scope.setPreset(lightID, role, preset)
					}
				})
			}
		}

		$scope.nullPreset = function(groupID){
			groupID = parseInt(groupID, 10)
			$scope.safeApply(function(){
				Groups.groups[groupID].preset = false
			})
		}
		
		// send command to make the light blink
		$scope.blinkLight = function(lightID){

		}

		//Change the light color according to the value returned from the colorpicker
		//Unfortunately the value is sent as a 6 digit hex number which does not correspond to the 
		//color values coded in the Hue
		$scope.colorChange = function(lightID, groupID) {
			if (groupID){
				$scope.nullPreset(groupID)
			}
			//Tried to transform the hex number into something hue friendly, but doesn't work well at all
			var color = { xy: $scope.lights[lightID].state.xy, bri: $scope.lights[lightID].state.bri }
			console.log('change hue for light '+lightID+' to:', color)

			//Update the light
			$.ajax({
					url: 'http://' + Bridge.IP() + '/api/newdeveloper/lights/' + lightID + '/state',
					data : JSON.stringify(color),
					type: 'PUT'
				})
				.done(function(result){
					console.log('hue updated: ', result)
				})
				.fail(function(requestObj, status){
					console.log(status)
				});
		}

		//This function is called when the brightness is changed by moving the slider
		//Slider values are between 0 (dark) and 255 (bright)
		$scope.sliderMove = function(lightID) {
			var brightness = { bri: parseInt($scope.lights[lightID].state.bri, 10) }
			console.log('change brightness for light '+lightID+' to:', brightness)

			$.ajax({
					url: 'http://' + Bridge.IP() + '/api/newdeveloper/lights/' + lightID + '/state',
					data : JSON.stringify(brightness),
					type: 'PUT',
					success: function(result) {
						console.log(JSON.stringify(result));
					}
				})
				.done(function(result){
					console.log('brightness updated: ', result)
				})
				.fail(function(requestObj, status){
					console.log(status)
				});
		}

		$scope.addGroup = function(){
			Groups.addGroup(function(name){
				console.log('group added: ', name)
			})
		}

		/*
		/------ Functions to send changes to lights
		*/
		$scope.setPreset = function(lightID, role, preset){
			var settings = Groups.presets[preset][role]
			_.assign($scope.lights[lightID].state, settings)
			// send changes to light
			$.ajax({
					url: 'http://' + Bridge.IP() + '/api/newdeveloper/lights/' + lightID + '/state',
					data : JSON.stringify($scope.lights[lightID].state),
					type: 'PUT'
				})
				.done(function(result){
					console.log('set preset for light '+lightID+': ', result)
				})
				.fail(function(requestObj, status, error){
					console.log(status, error)
				});
		}

		$scope.toggleLight = function(lightID) {
			console.log(lightID)
			$scope.lights[lightID].state.on = !$scope.lights[lightID].state.on
			console.log($scope.lights[lightID].state.on)
			$.ajax({
					url: 'http://' + Bridge.IP() + '/api/newdeveloper/lights/' + lightID + '/state',
					data : JSON.stringify({'on': $scope.lights[lightID].state.on}),
					type: 'PUT'
				})
				.done(function(result){
					console.log('change sent', result)
				})
				.fail(function(requestObj, status, error){
					console.log(status, error)
				});
		}

		/*
		/------------- Find bridge, and load initial states of all lights
		*/

		$scope.loadLights = function(){
			console.log(navigator.onLine)
			if (!$scope.testing){
				if (navigator.onLine) { // hey, that's cool, didn't know navigator existed!
					// moved the nupnp query logic to the Bridge service
					Bridge.tryPNP()
				} else {
					console.log('not online, scan IPs')
					Bridge.connectHueNewIp()
				}
			}
		}

		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

	}])