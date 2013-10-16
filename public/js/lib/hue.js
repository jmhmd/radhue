var connectIP;
var dataStruct = {
					"on" : null,
					"bri" : null,
					"hue" : null,
					"sat" : null,
					"xy" : [null, null],
					"ct" : null,
					"alert" : "",
					"effect" : ""
				};

$( function() {
	$.get("http://www.meethue.com/api/nupnp", function(result, textStatus){
    	if(textStatus = "success") {
    		connectIP = result[0].internalipaddress;
    		console.log("Hue Bridge Found: " + connectIP);
    	}
    	else {
    		console.log("No Hue Bridge is identified");
    	}
    });
});

function infoLight() {
	$.get("http://" + connectIP + "/api/newdeveloper", function(result, status) {
		if(status == "success") {
			for(var i in result.lights) {
				$('#lightMenu').append('<body>' + result.lights[i].name + '</body>   ' + 
					'<button id=' + i + ' onclick="buttonClick(this.id)">  ' + result.lights[i].state.on + '</button>' +
					'<br>');
			}
		}
	});

	$.get("http://" + connectIP + "/api/newdeveloper", function(result, status) {
		if(status == "success") {
			dataStruct = result.lights[1].state;
		}
	});
};

function toggleLight() {
	var resultBox = $('#annotationResult');
	var switchName = $('#Lightswitch');

	if(dataStruct.on == true) {
		dataStruct.on = false;
		switchName.html("Light ON")
	}
	else {
		dataStruct.on = true;
		switchName.html("Light OFF")
	}

	$.ajax({
	    url: 'http://' + connectIP + '/api/newdeveloper/lights/1/state',
	    data : JSON.stringify(dataStruct),
	    type: 'PUT',
	    success: function(result) {
	        //console.log(JSON.stringify(result));
	    }
	});
};

function buttonClick(lightID) {
	$.get("http://" + connectIP + "/api/newdeveloper", function(result, status) {
		if(status == "success") {
			if(result.lights[lightID].state.on == true) {
				result.lights[lightID].state.on = false;
			}
			else {
				result.lights[lightID].state.on = true;
			}
		}
	}).done( function(result) {
		$.ajax({
		    url: 'http://' + connectIP + '/api/newdeveloper/lights/' + lightID + '/state',
		    data : JSON.stringify(result.lights[lightID].state),
		    type: 'PUT',
			success: function(result) {
				$('#' + lightID + '').html('ON');
		    }
		});
	});
}

function getHueIP(){
	var resultBox = $('#annotationResult');

	$.get("http://" + connectIP + "/api/newdeveloper", function(result, status) {
		if(status == "success") {
			dataStruct = result.lights[1].state;

			resultBox.html(JSON.stringify(dataStruct));
		}
	});

	//resultBox.html(JSON.stringify(dataStruct));
};