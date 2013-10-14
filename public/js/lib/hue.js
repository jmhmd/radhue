var connectTimer;
var connectIP;
var connectCount = 0;
var timeout = 10;

function infoLight() {
	console.log("Got Here");
	var resultBox = $('#annotationResult');

	$.get("http://192.168.1.3/api/newdeveloper", function(result, status) {
		if(status == "success") {
			resultBox.html(JSON.stringify(result));
		}
	});
};

function toggleLight() {

	var putdata = new Object(); 
		putdata.on = true;
		putdata.bri = 150;
		putdata.alert = "select";

	$.ajax({
	    url: 'http://192.168.1.3/api/newdeveloper/lights/1/state',
	    data : JSON.stringify(putdata),
	    type: 'PUT',
	    success: function(result) {
	        // Do something with the result
	        console.log(result);
	    }
	});
};

function getHueIP(){
	$.get("http://www.meethue.com/api/nupnp", function(result, textStatus){
    	console.log(result[0].internalipaddress);
    });
};


var nointerval;
/*
function hueFindRange(ip, continueAfter, percent, nointerval){
	// Connect
	nointerval = nointerval;
	var obj = new Object();
	obj.username 	= username;
	obj.devicetype 	= "Hue Connect API Client";	
	console.log('hueFindRange :: '+ip);
	
	if(!stopSearching){
	
		$('.percent-bar').html('<div class="percent" style="width: '+percent+'%;">'+percent+'%</div>');

	}
	$('#ip-lookup').html(ip);	
	
	
	$.ajax('http://'+ip+'/api/'+username, {
	    type : 'GET',
	     timeout:500,
		success: function(data){   

			stopSearching = true;	           
			
			console.log('Connect :: Check Hub : Username: '+username);
			console.log(data);
			//console.log('Error in data: '+(data[0].hasOwnProperty("error")));
			if(data[0] != undefined){
				if(data[0].hasOwnProperty("error")){
					console.log('ERROR from Hub :: HUE Found, press connect : '+ip);						
					console.log(data.error);
					connectHubPress(ip, continueAfter, percent, nointerval)
					//connectHubPress(ip, continueAfter, percent, nointerval)
												
				}
			}
			if("lights" in data == true){
				stopSearching = true;
				console.log('SUCCESS Key exists :: data.lights: '+username);
				hueDevices(ip, obj.username);
			}
		},  
		error: function(data){  
			//console.log('Not found: '+ip);
			if(stopSearching == false){
				hueFindNext();
			}
			//console.log(data);		 
		},
		statusCode: {
		    404: function() {
		     // console.log("Not found: "+ip);
		    }
		  } 	    
    });	

}


function connectHubPress(ip, continueAfter, percent, nointerval){
	
	var obj = new Object();
	obj.username 	= username;
	obj.devicetype 	= "Hue Connect API Client";		
	$.ajax('http://'+ip+'/api/', {
	    data : JSON.stringify(obj),
	    contentType : 'application/json',
	    type : 'POST',
	     timeout:500,
		success: function(data){   
			stopSearching = true;	           
			console.log('Connect :: Loaded : Username: ');
			console.log(data);
			if(typeof data.error != undefined){
	        	stopSearching = true;
				console.log('Connect :: HUE Found, press connect : '+ip);						
				$("#ip-address").attr('placeholder', ip);
				//console.log('Connect :: Error');
				$.mobile.changePage( $("#connect-hub"), "slide", true, true);
				
				connectIP = ip;
				
				if(!nointerval){
					$('#timer-wrap').html('<div id="timer-wrap"><ul><li><div id="timer-display"><div id="countdown">'+(timeout+1)+'</div></div></li><li><a href="#hub-not-found" id="cancel-connct-hub" class="btn-mode grey" data-rel="_back">Cancel</a></li></ul>');
					connectTimer = window.setInterval(connectHueNewIp, 1000);
				}
				
				console.log(data[0].error);
											
			}else{
				hueDevices(ip, obj.username); // Check to see if key 
			}
		},  
		error: function(data){  
			//console.log('Not found: '+ip);
			if(stopSearching == false){
			hueFindNext();
			}
			//console.log(data);		 
		},
		statusCode: {
		    404: function() {
		     // console.log("Not found: "+ip);
		    }
		  } 	    
    });	
}

var currentIPRange = 1;
var stopSearching = false;
function hueFindNext(){
	// 192.168.1.187	
	
	if(currentIPRange < 254 && settings == undefined && stopSearching == false){
		currentIPRange++;
		hueFindRange('10.0.1.'+currentIPRange, stopSearching);			
		hueFindRange('10.0.0.'+currentIPRange, stopSearching);	
		hueFindRange('192.168.1.'+currentIPRange, stopSearching);			
		hueFindRange('192.168.1.'+currentIPRange, stopSearching,Math.floor((currentIPRange/254)*100));
		//$.mobile.loading('hide');
				
	}else if(settings != undefined){
		console.log('Hue found: '+settings.ip);
		
		hueFindComplete();
		hueDevices(settings.ip, settings.username);
		window.clearInterval(connectTimer);		
		$.mobile.changePage( $("#lights"), "slide", true, true);
		alert($('#lights'));
		
		//$.mobile.loading('hide');		
		
	}else{
		console.log('Hue not found...');
		//$.mobile.loading('hide');
		currentIPRange = 1;
		stopSearching = true;
		
		$.mobile.changePage( $("#hub-not-found"), "slide", true, true);
		
		
	}
}


function hueFindComplete(){
	//hueDevices(settings.ip, settings.username);
	//$('.light-panel').show();	
	
	
	$.mobile.changePage( $("#lights"), "slide", true, true);
	
	// DEBUG
	//$.mobile.changePage( $("#navigator"), "slide", true, true);				
	//$.mobile.changePage( $("#page-color-picker"), "none", true, true);					
}

// ! -------- Settings --------





var settings;
var username = 'HueConnect';

function getSettings(){
	
	var ip 				= '10.0.0.9';
	var username 		= 'HueConnect';
	
	// Retrieve the object from storage
	var retrievedObject = localStorage.getItem('settings');
	console.log('Settings: ', JSON.parse(retrievedObject));
	console.log('getSettings ::'+ (retrievedObject != null));
	if(retrievedObject != null){
		settings = JSON.parse(retrievedObject);
		$('#ip-address-display').html(settings.ip);
		return true;
	}else{
		return false;		
	}
}

function saveSettings(ip, username){

	var settings = { 'ip': ip, 'username': username};
	localStorage.setItem('settings', JSON.stringify(settings));	
	console.log('Save Settings :: ');
	console.log(settings);
	getSettings();
}


function isIP(ip) {
//    return date.match(/^(3[0-1]|[0-2]?[0-9])\/(0?[0-9]|1[0-2])\/([1-2][0-9]{3})$/);
	return ip.match(/^((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$/);
}

// ! -------- Document ready --------

$(function () {



	//console.log('Convert color: '+(rgbToHsv(10,255,10)));


//$(['img/radar-background.png', 'img/connect-hub-on.png','img/icon-settings.png','img/on_off.png','img/radar-background.png','img/radar.png','img/spinner_192.gif']).preload();



	$('#cancel-connct-hub').live('click', function(){
		console.log('Cancel connect hub');
		connectCount = 0;
		window.clearInterval(connectTimer);
		
	});
	
	$('#save-ip-address').live('click', function(){
		var tmpIP = $('#ip-address').val();
		if(isIP(tmpIP)){
		currentIP = tmpIP;
		hueFindRange(tmpIP, false, 1, false);
		}else{
			
			console.log('Not a valid ip address:'+tmpIP);
		}
		//connectHueNewIp();
		
	});
	
	$('.search-hue').live('click', function(){
		console.log('Search for Hue...');
		settings = null;
		connectCount = 0;
		currentIPRange 	= 1;
		stopSearching 	= false;	
		hueFindNext();
		
	});
	
	$('.reset-hue').live('click', function(){
		console.log('Reset settings...');
		settings = null;
		localStorage.clear();
		connectCount 	= 0;
		currentIPRange 	= 1;
		stopSearching 	= false;	
		
		hueFindNext();
		
	});	


	
		
	var current_light 	= 0;	
	
	
	// ! ----> Get settings
	if(getSettings()){
		console.log('Settings: ');
		console.log(settings);
		hueDevices(settings.ip, settings.username);
	
		//$.mobile.changePage( $("#connect-hub"), "slide", true, true);				
		//$.mobile.changePage( $("#search"), "slide", true, true);						
		$.mobile.changePage( $("#lights"), "slide", true, true);
		//$.mobile.changePage( $("#hub-not-found"), "slide", true, true);		
		//$('.light-panel').show();
	}else{
		//connectHue(ip);
		console.log('Get HUE IP...');
		//$.mobile.changePage( $("#search"), "slide", true, true);
		$.mobile.changePage( $("#initial-options"), "slide", true, true);		
//		$.mobile.changePage( $("#connect-hub-enter-ip"), "slide", true, true);		
		// show dialog
		//hueFind();	
		//confirm();	
		
	}
	

	
	// Colorpicker, Farbtastic
	var d = new Date();
	function callback(color) {
		//console.log('callback: '+$.farbtastic('#color-picker').hsl[2]);
		$('.color-bulb .mask').css('backgroundColor', color);
		$('.color-display').css('backgroundColor', color);		

		if((new Date)-d > 100){
			d = new Date();
			var hsl = $.farbtastic('#color-picker').hsl;
			var hue 		= Math.floor(hsl[0]*65535);
			var saturation 	= Math.floor(hsl[1]*255);
			var brightness 	= Math.floor(hsl[2]*255);
			console.log('hue: '+hue+' saturation: '+saturation+' brightness: '+brightness);
			hueColor(settings.ip, settings.username, current_light, brightness, hue, saturation);			
		}else{
			//console.log(d-(new Date));
		}
				
		//

		

//		console.log($.farbtastic('#color-picker').HSLToRGB(hsl));
		//console.log(hsl[2]*255*1.25);
		//console.log($.farbtastic('#color-picker').HSLToRGB(hsl[0]+0.4,hsl[1]+0.4,hsl[2]*1.1));
		
		//$('.color-bulb .brightness').css('backgroundColor', 'rgba(255,240,255,'+((hsl[2]*255))+')');		
		$('.color-bulb .color').css('backgroundColor', color);
		
		if($.farbtastic('#color-picker').hsl[2] < 0.1){
			$('.color-bulb #coloring').css('opacity', (($.farbtastic('#color-picker').hsl[2])));					
			$('.color-bulb .brightness').css('opacity', (($.farbtastic('#color-picker').hsl[2])));		
			$('.color-bulb .color').css('opacity', (($.farbtastic('#color-picker').hsl[2])));					
		}else{
			$('.color-bulb .brightness').css('opacity', (($.farbtastic('#color-picker').hsl[2]))+.6);				
			$('.color-bulb .color').css('opacity', (($.farbtastic('#color-picker').hsl[2]))-0.5);
			$('.color-bulb #coloring').css('opacity', (($.farbtastic('#color-picker').hsl[2]))+.4);					
		}
//		
		
		
	}	
	//$('#color-picker').farbtastic('#color', callback); // get hsl: http://acko.net/blog/farbtastic-jquery-color-picker-plug-in/
	$('#color-picker').addTouch();
	
	$.farbtastic('#color-picker', callback).setColor('#823cb3');;
	//$.farbtastic('#color-picker').setColor('#823cb3');

	console.log('change: '+$(this).val());




	
	//connectHue(ip);

	$('#connect').click(function(){
		hueConnect(ip);
    });

	$('.light').live('click', function(){
		//alert($(this).attr('rel'));
		
		$('.light').removeClass('active');
		$(this).addClass('active');
					
		if($(this).hasClass('all-lights')){
			//$(".controls").slideUp(400);			
			$(".controls").hide();
			try{
	        $(".iscroll-wrapper").iscrollview("refresh");			
	        }catch(e){}
		}else{
			//$(".controls").slideDown(400);
			$(".controls").show();
			try{
			$(".iscroll-wrapper").iscrollview("refresh");
			}catch(e){}
			$('#slider').val($(this).attr('bri'));
			
			if($(this).hasClass('on')){
				$('#switch').val('true').slider('refresh');
			}else{
				$('#switch').val('false').slider('refresh');			
			}
		
			current_light = $(this).attr('rel');	
		    $('#slider').slider('refresh');		

			
		
		}
		
		
		var switch_on = true;
		if($(this).hasClass('on')){
			$(this).removeClass('on');
			$(this).addClass('off');			
			switch_on = false;
		}else{
			$(this).removeClass('off');
			$(this).addClass('on');			
			switch_on = true;			
			
		}
		hueSwitchLight(ip, username, $(this).attr('rel'), switch_on);
		
	});


//	$('#switch').change(function(){



	$('.switch').live('change',function(){

		if($(this).parent().hasClass('all-lights')){
			$(".controls").slideUp(400);			
			var switch_on = $(this).find('select').val();
			
			$('.lights .light').find('select').val(switch_on).slider("refresh");;

			
			if($(this).parent().hasClass('on')){
				$('.light').removeClass('on');
				$('.light').addClass('off');			
				//switch_on = false;
			}else{
				$('.light').removeClass('off');
				$('.light').addClass('on');			
				//switch_on = true;			
				
			}		
			
			$('.lights .light').removeClass('active');
			current_light = 0;
			$(this).parent().addClass('active');
			if(switch_on == 'true'){
				for(var i = 0; i < $('.light').length; i++){
					hueSwitchLight(settings.ip, settings.username, i, true);
				}
				
			}else{
				for(var i = 0; i < $('.light').length; i++){
					hueSwitchLight(settings.ip, settings.username, i, false);
				}
			}
			

					
			
		}else{
			sliderEnabled = false;
			var switch_on = $(this).find('select').val();
			
			
			if($(this).parent().hasClass('on')){
				$(this).parent().removeClass('on');
				$(this).parent().addClass('off');			
				//switch_on = false;
			}else{
				$(this).parent().removeClass('off');
				$(this).parent().addClass('on');			
				//switch_on = true;			
				
			}		
			console.log('switch click: '+switch_on+' light: '+current_light+' : '+(new Date()));		
			
			$('.light').removeClass('active');
			current_light = $(this).parent().attr('rel');
			$(this).parent().addClass('active');
			if(switch_on == 'true'){
				hueSwitchLight(settings.ip, settings.username, current_light, true);
				if($('.active').hasClass('off')){
					$('.active').removeClass('off');
					$('.active').addClass('on');			
	
				}			
				
			}else{
				hueSwitchLight(settings.ip, settings.username, current_light, false);
				if($('.active').hasClass('on')){
					$('.active').removeClass('on');
					$('.active').addClass('off');			
				}						
			}
		}
	});
    
    
    var putdata = new Object(); // {"bri": 254, "on": true} 
    putdata.on = true;

	//var sliderTimer;
	function checkSlider(){
		console.log('CheckSlider :: Value: '+$('#slider').val());
		var val = parseInt($('#slider').val());
		if(val == 0){
			hueSwitchLight(settings.ip, settings.username, current_light, false);
			if($('.active').hasClass('on')){
				$('.active').removeClass('on');
				$('.active').addClass('off');			
			}			
		}else{		
			if($('.active').hasClass('off')){
				$('.active').removeClass('off');
				$('.active').addClass('on');			

			}

		    hueBrightness(settings.ip, settings.username, current_light,parseInt($('#slider').val()));	    	    		
		    
	    }
		$('.active').attr('bri', $('#slider').val());	    
	}

	var sliderEnabled = false;
	

	var sliderTmp = new Date();
	$('#slider').live('change',function(){
	    var slider_value = $(this).val();
	    if((new Date)-sliderTmp > 100){
			sliderTmp = new Date();
			checkSlider();
			
		}
		    
	});	
	
	
	
	$('.slider').live('mousedown',function(){

		console.log('Enable slider');
		sliderEnabled = true;
		if(current_light != 0){					
		//window.clearInterval(sliderTimer);
		//sliderTimer = window.setInterval(checkSlider, 400); // limit to 30 requests per second for the hub
	    console.log('slider DOWN: ');		
	    }
	});
	
	$('.slider').live('touchstart',function(){
		//window.clearInterval(sliderTimer);
		//sliderTimer = window.setInterval(checkSlider, 400); // limit to 30 requests per second for the hub
	    console.log('slider DOWN: ');		
	});	
	
	$('.slider').live('touchend',function(){

		//window.clearInterval(sliderTimer);
		if(current_light != 0 && sliderEnabled){
		//checkSlider();		
		}
		
		//alert('touch end');		
	});
	
	$('body').live('mouseup',function(){
		// touchend i stedet for 

		//window.clearInterval(sliderTimer);	
		if(current_light != 0 && sliderEnabled){
			console.log('Touch end');
			checkSlider();	
			sliderEnabled = false;
		}
	});		
    
  
});


// ! -------- Hue Methods --------
function hueSwitchLight(ip, username, light_id, on_off){	
	    var putdata = new Object(); // {"bri": 254, "on": true} 
		putdata.on = on_off;
		//putdata.transitiontime = 0;

		$.ajax({
	    url: 'http://'+ip+'/api/'+username+'/lights/'+light_id+'/state',
	    data : JSON.stringify(putdata),
	    type: 'PUT',
	    success: function(result) {
	        // Do something with the result
	        console.log(result);
	    }
	    });
}

function hueBrightness(ip, username, light_id, brightness){	

	    var putdata = new Object(); // {"bri": 254, "on": true} 
		putdata.bri = brightness;
		putdata.on = true;		
		//putdata.transitiontime = 0;		

		$.ajax({
	    url: 'http://'+ip+'/api/'+username+'/lights/'+light_id+'/state',
	    data : JSON.stringify(putdata),
	    type: 'PUT',
	    success: function(result) {
	        // Do something with the result
	        console.log(result);
	    }
	    });
}


function hueColor(ip, username, light_id, brightness, hue, saturation){	

	    var putdata = new Object(); // {"bri": 254, "on": true} 
		putdata.bri = brightness;
		putdata.hue = hue;
		putdata.sat = saturation;				
		putdata.on = true;		
		//putdata.transitiontime = 0;		

		$.ajax({
	    url: 'http://'+ip+'/api/'+username+'/lights/'+light_id+'/state',
	    data : JSON.stringify(putdata),
	    type: 'PUT',
	    success: function(result) {
	        // Do something with the result
	        console.log(result);
	    }
	    });
}



function hueDevices(ip,username){	

	$.ajax({
	    url: 'http://'+ip+'/api/'+username,
	    type: 'GET',
	    success: function(result) {
	        // Do something with the result
	        console.log(result);
	        
	        // Check if object exists
	        if(typeof(result[0]) != null && !result.lights){

			}else{
				saveSettings(ip, username);	
				console.log('Connect :: HUE Found & connected: '+ip);						
				console.log(result);			
				hueFindComplete();
				window.clearInterval(connectTimer);				
				
			var lights = result.lights;
	        var id = 0;
	        $('.light:not(.all-lights)').remove();
			$(".controls").hide();	        
			
	        $.each(lights, function(key, light) {
	        	id++;
		        console.log('Light: ');
		        console.log(light);
		        var light_on;
		        if(light.state.on){
			        light_on = 'on';

					$('.lights').append('<a href="#" on="'+light.state.on+'" bri="'+light.state.bri+'" class="light '+light_on+'" rel="'+id+'"><span class="icon '+light.name+'"></span><span>'+light.name+'</span><div class="switch"><select name="flip-1" id="_switch" data-role="slider"><option value="false">Off</option><option value="true"  selected="selected">On</option></select></div></a>');		        
			        
		        }else{
			        light_on = 'off';			        
			        $('.lights').append('<a href="#" on="'+light.state.on+'" bri="'+light.state.bri+'" class="light '+light_on+'" rel="'+id+'"><span class="icon '+light.name+'"></span><span>'+light.name+'</span><div class="switch"><select name="flip-1" id="_switch" data-role="slider"><option value="false" selected="selected">Off</option><option value="true">On</option></select></div></a>');		        
		        }
		     	   
		        
					

	        });				
	        try{
	        $(".iscroll-wrapper").iscrollview("refresh");
	        }catch(e){}

	        
			}	        
	        
	        
	        
	        
	        
			$('.lights').trigger('create');
			//$('.lights').listview('refresh');						        
			
	    }
    });

	
}


function hueConnect(ip){
	// Connect
	var obj = new Object();
	obj.username 	= username;
	obj.devicetype 	= "Hue Connect API Client";	

	$.ajax('http://'+ip+'/api', {
	    data : JSON.stringify(obj),
	    contentType : 'application/json',
	    type : 'POST',
		success: function(data){              
			console.log('Connect :: Loaded');

			if(data[0].error){
				console.log('Connect :: Error');
				console.log(data[0].error);
				$.mobile.changePage( $("#search"), "slide", true, true);
				
				
			}else{
				console.log(data);				
			}
		},  
		error: function(data){  
			console.log('Error');
			console.log(data);		 
		}  	    
    });	
}
 

//$.fn.preload = function() {
//    this.each(function(){
//        $('<img/>')[0].src = this;
//        console.log('Preloading: '+this);
//    });
//}


// iScroll 
function onPullDown(event, data) {
	console.log('Refresh lights ');
	$(".controls").slideUp(400);		
	setTimeout(function(){
		hueDevices(settings.ip, settings.username);
		data.iscrollview.refresh(); 
	}, 800);		
}

function onPullUp() {
	console.log('onPullUp: ');
}



$(document).delegate("#lights", "pageinit", function(event) {

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {

        $(".iscroll-wrapper", this).bind( { 
        "iscroll_onpulldown" : onPullDown,    
        "iscroll_onpullup"   : onPullUp
        });
        }
});
*/
