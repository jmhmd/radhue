'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.groups', [])
	.factory('Groups', function(){
		var groups = [], // define groups array, and add one blank group by default
			presets = {
				default: {
					backlight: {
						hue: '', // this should change to whatever the best backlight blue hue is in the literature
						bri: '',
						sat: ''
					},
					overhead1: {
						hue: '',
						bri: '',
						sat: ''
					},
					overhead2: {
						hue: '',
						bri: '',
						sat: ''
					}
				},
				studyAlert: {
					backlight: {
						hue: '', // this one could turn a red hue to indicate a stat study?
						bri: '',
						sat: ''
					},
					overhead1: {
						hue: '',
						bri: '',
						sat: ''
					},
					overhead2: {
						hue: '',
						bri: '',
						sat: ''
					}
				},
				warm: {
					backlight: {
						hue: '', // warmer general hue
						bri: '',
						sat: ''
					},
					overhead1: {
						hue: '',
						bri: '',
						sat: ''
					},
					overhead2: {
						hue: '',
						bri: '',
						sat: ''
					}
				},
				cool: {
					backlight: {
						hue: '', // cooler general hue
						bri: '',
						sat: ''
					},
					overhead1: {
						hue: '',
						bri: '',
						sat: ''
					},
					overhead2: {
						hue: '',
						bri: '',
						sat: ''
					}
				}
			}


		/*
		/ Look for saved group configurations on localstorage
		*/


		function addGroup(name, cb){
			if (_.isFunction(name)){
				cb = name
				name = false
			}
			var group = {
			// defining default values for a new group
				name: name || 'New Workstation ' + (groups.length + 1), // 'workstation 1' or 'TeraRecon workstation' or something descriptive like that
				lights: {
					backlight: null, // set these to light id numbers
					overhead1: null,
					overhead2: null
				},
				preset: false
			}
			groups.push(group)
			if(_.isFunction(cb)){ cb(group.name) }
		}

		return {
			groups: groups,
			addGroup: addGroup,
			presets: presets
		}
	})