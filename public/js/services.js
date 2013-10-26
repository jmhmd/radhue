'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.factory('Groups', function(){
		var group = {
			// defining default values for a new group
				name: '', // 'workstation 1' or 'TeraRecon workstation' or something descriptive like that
				backlight: null, // set these to light id numbers
				overhead1: null,
				overhead2: null,
				preset: false
			},
			groups = [group], // define groups array, and add one blank group by default
			presets = {
				default: {

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
			addGroup: addGroup
		}
	})
	.factory('Bridge', function(){

	})