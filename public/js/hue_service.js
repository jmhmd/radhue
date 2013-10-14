
// ! -------- Find IP address --------

var connectTimer;
var connectIP;
var connectCount = 0;
var timeout = 10;

function connectHueNewIp(){
	console.log('Connect 321:: connectHueNewIp...'+connectCount);
	if(connectCount <= timeout){
		console.log('Connect :: Trying to connect (Press): '+connectIP);
		connectCount++;
		hueFindRange(connectIP, false, 0, true);
	}else{
		window.clearInterval(connectTimer);
		console.log('Connect :: Timeout...');
		connectCount = 0;
	}
}
var nointerval;

function hueFindRange(ip, continueAfter, percent, nointerval){
	// Connect
	nointerval = nointerval;
	var obj = new Object();
	obj.username 	= username;
	obj.devicetype 	= "Hue Connect API Client";	
	console.log('hueFindRange :: '+ip);
	
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
		/*
		hueFindComplete();
		hueDevices(settings.ip, settings.username);
		window.clearInterval(connectTimer);		
		$.mobile.changePage( $("#lights"), "slide", true, true);
		alert($('#lights'));
		*/
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
	/*
	var ip 				= '10.0.0.9';
	var username 		= 'HueConnect';
	*/
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
 

$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
        console.log('Preloading: '+this);
    });
}


/* iScroll */
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
