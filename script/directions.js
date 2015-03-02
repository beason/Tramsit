
var dataObj;

function getDirections() {
    $('#instructions').html('');
    var cLong = sessionData.userLoc.split(',')[1];
    var cLat = sessionData.userLoc.split(',')[0];

    var dLong = tramStops[sessionData.destination].stopLong;
    var dLat = tramStops[sessionData.destination].stopLat;

    var start_stop = tramStops[sessionData.startStop].stopName + ' tram stop';
    var end_stop = tramStops[sessionData.destination].stopName + ' tram stop';

    var start_stop_final = start_stop.replace(/\s+/g, '+');
    var end_stop_final = end_stop.replace(/\s+/g, '+');
 
    var date = new Date()
    var currentTime = Math.round((new Date()).getTime() / 1000);
    // var currentTime = 1427180400;

    console.log(currentTime);
    var mapsUrl = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + start_stop_final + '&destination=' + end_stop_final + '&sensor=false&mode=transit&departure_time=' + currentTime;
    var testUrl = encodeURIComponent(mapsUrl);



$.YQL = function(query, callback) {
 
    if (!query || !callback) {
        throw new Error('$.YQL(): Parameters may be undefined');
    }
 
    var encodedQuery = query.toLowerCase(),
        url = 'http://query.yahooapis.com/v1/public/yql?q='
            + encodedQuery + '&format=json&callback=?';
    $.getJSON(url, callback);
 
};

	$.YQL("select * from json where url='" + testUrl + "'" , function(data) {
          
                console.log(data);
                dataObj = data.query.results.json.routes;

            stepsCount = Object.keys(dataObj.legs.steps).length;

            if (stepsCount >= 3) {
                timeDiff = (dataObj.legs.steps.transit_details.departure_time.value) - currentTime;
            } else {
                timeDiff = (dataObj.legs.steps[0].transit_details.departure_time.value) - currentTime;

            }

            
            var mindiff = Math.floor( timeDiff / 60 );
            
            $('.time-wait').text(isMinutes(mindiff));
            
            showSteps(dataObj, stepsCount);
          
		  
});
}

function isMinutes(timeM) {
  if (timeM > 1) {
      return timeM + ' Minutes';
  } else {
    return timeM = 'Due';
  }
}


function showTime(data) {
    var leg = data.query.results.json.routes.legs;
    var msg = 'Time from ' +
        leg.start_address + ' to ' +
        leg.end_address + ' is ' +
        leg.duration.text + '!';
    return msg;
}

function showSteps(dataObj, stepsCount) {
    i = 0;
    if (stepsCount >= 3) {
        
    
        $('#instructions').append('<li class="'+ (dataObj.legs.steps.transit_details.line.short_name).replace(/\s+/g, "")+ '"><span class="depart_time">'+ dataObj.legs.steps.transit_details.departure_time.text+ '</span><span class="leg-duration">'+ dataObj.legs.steps.duration.text +'</span><span class="blob b_top"></span><span class="arrv_time">'+ dataObj.legs.steps.transit_details.arrival_time.text+ '</span><span class="blob b_bottom"></span><span class="step_inst"><span class="step-stopName stepDep">'+ dataObj.legs.steps.transit_details.departure_stop.name + '</span> <span class="step-stopName stepArrv">' + dataObj.legs.steps.transit_details.arrival_stop.name + ' </span></li>');
        
    } else {
        $.each(dataObj.legs.steps, function(key, value) {
        if (i != 1)  {
        $('#instructions').append('<li class="'+ (this.transit_details.line.short_name).replace(/\s+/g, "")+ '"><span class="depart_time">'+ this.transit_details.departure_time.text+ '</span><span class="leg-duration">'+ this.duration.text +'</span><span class="blob b_top"></span><span class="blob b_bottom"></span><span class="step_inst"><span class="step-stopName stepDep">'+ this.transit_details.departure_stop.name + '</span> <span class="step-stopName stepArrv">' + this.transit_details.arrival_stop.name + '</span></li>');
        i++;
        } else {
        $('#instructions').append('<li class="'+ (this.transit_details.line.short_name).replace(/\s+/g, "")+ '"><span class="depart_time second-dep">'+ this.transit_details.departure_time.text+ '</span><span class="leg-duration">'+ this.duration.text +'</span><span class="arrv_time">'+ this.transit_details.arrival_time.text+ '</span><span class="blob b_bottom"> <span class="step_inst"><span class="step-stopName stepArrv">' + this.transit_details.arrival_stop.name + '</span></li>');
        }
        
    });

    }

}
