'use strict';

/* Directives */

angular.module('myApp.directives', []).
	directive('colorPicker', function () {
		return {
			scope: {
				lights: '=',
				change: '&',
				lightId: '@',
				groupId: '@'
				// dataControl: '@'
			},
			link: function(scope, elm, attrs) {
				scope.$watch('lightId', function(newVal, oldVal){
					if (!newVal){ return false }

					// convert hue to hex
					// returns hex string
					function hueToHex(state){
						return colorConverter.rgbToHexString(colorConverter.xyBriToRgb({
							x: state.xy[0],
							y: state.xy[1],
							bri: state.bri / 255
						}))
					}

					// convert hex to hue
					// returns object {x: int, y: int, bri: int}
					function hexToHue(hex){
						var hexString = hex.substring(1)
						return colorConverter.hexStringToXyBri(hexString)
					}
					$(elm).minicolors({
						control: attrs.control || 'hue',
						theme: 'default',
						//defaultValue: hueToHex(scope.lights[scope.lightId].state.hue),
						defaultValue: hueToHex(scope.lights[scope.lightId].state),
						change: function(hex, opacity) {
							var log;
							log = hex ? hex : 'transparent';
							if (opacity){ log += ', ' + opacity; }
							// colorChange(hex);
							var xyBri = hexToHue(hex)
							scope.lights[scope.lightId].state.xy = [xyBri.x, xyBri.y]
							scope.lights[scope.lightId].state.bri = xyBri.bri * 255
							scope.change({lightID: scope.lightId, groupID: scope.groupId})
						},
					});
					elm.addClass('minicolors-input')
				})
			}
		}
	})
