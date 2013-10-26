'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.factory('Groups', function(){
		var group = {
			// defining default values for a new group
				name: '', // 'workstation 1' or 'TeraRecon workstation' or something descriptive like that
				lights: {
					backlight: null, // set these to light id numbers
					overhead1: null,
					overhead2: null
				},
				preset: false
			},
			groups = [group], // define groups array, and add one blank group by default
			presets = {
				default: {
					backlight: {
						color: '', // this should change to whatever the best backlight blue hue is in the literature
						brightness: '',
						saturation: ''
					},
					overhead1: {
						color: '',
						brightness: '',
						saturation: ''
					},
					overhead2: {
						color: '',
						brightness: '',
						saturation: ''
					}
				},
				studyAlert: {
					backlight: {
						color: '', // this one could turn a red color to indicate a stat study?
						brightness: '',
						saturation: ''
					},
					overhead1: {
						color: '',
						brightness: '',
						saturation: ''
					},
					overhead2: {
						color: '',
						brightness: '',
						saturation: ''
					}
				},
				warm: {
					backlight: {
						color: '', // warmer general hue
						brightness: '',
						saturation: ''
					},
					overhead1: {
						color: '',
						brightness: '',
						saturation: ''
					},
					overhead2: {
						color: '',
						brightness: '',
						saturation: ''
					}
				},
				cool: {
					backlight: {
						color: '', // cooler general hue
						brightness: '',
						saturation: ''
					},
					overhead1: {
						color: '',
						brightness: '',
						saturation: ''
					},
					overhead2: {
						color: '',
						brightness: '',
						saturation: ''
					}
				}
			}


		/*
		/ Look for saved group configurations on localstorage
		*/


		function addGroup(name, cb){
			var newGroup = _.defaults({name: name}, group)
			group.push(newGroup)
			if(_.isFunction(cb)){ cb(name) }
		}

		return {
			groups: groups,
			addGroup: addGroup,
			presets: presets
		}
	})
	.factory('Bridge', function(){

	})