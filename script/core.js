var distances = [];
var sessionData = {
userLoc:"",
startStop: "",
destination: ""
}



var directionsDisplay;
var directionsService;
var map;
var myLatlng;
var stopLatlng;

var goToDest;

function initiate_geolocation() {
    navigator.geolocation.getCurrentPosition(success,errors);
}
 
function errors(error) {
    $('#journey-planner').addClass('with-no-geo');
}

function success(position){
  $('.no-geo').addClass('with-geo');
  $('#journey-planner').addClass('move-up');
updateObject( sessionData, 'userLoc', (position.coords.latitude + ',' + position.coords.longitude))
  userLat = position.coords.latitude;
  userLong = position.coords.longitude;
  for (var i = 0; i < Object.keys(tramStops).length; i++) {
    stopLat = tramStops[i].stopLat;
    stopLong = tramStops[i].stopLong;
    distances.push({stop: i, distance: calcDistance(userLat, userLong, stopLat, stopLong)})

  }
 

  distances.sort(function(a, b){
    return a.distance-b.distance;
  })

closestStop = distances[0].stop;
   updateObject(sessionData, 'startStop', closestStop)
 
  // getMap(closestStop)
    }

$.getJSON("data/tramStops.json", function(data) {
    tramStops = data;
   for (var i = 0; i < Object.keys(tramStops).length; i++) {
        $('.tram-stops').append('<option data-stop='+ i +'>' + tramStops[i].stopName + '</option>');
    }
  $('.overlay,#stop-directions').show();
  initiate_geolocation()

});




// Stops elastic bounce on iOS
$(document).bind('touchmove',function(e) {e.preventDefault();});


// // remove black bar iOS
// if (window.navigator.standalone) {
//     $("meta[name='apple-mobile-web-app-status-bar-style']").remove();
// }










 $('#end-stop').change(function() {
    $('.bottom').addClass('show-btn');
    $('.logo').addClass('move-logo');
    
    updateObject(sessionData, 'destination', $(this)[0].selectedIndex - 1)
  })

  $('#start-stop').change(function() {
    updateObject(sessionData, 'startStop', $(this)[0].selectedIndex - 1);
    $('#journey-planner').addClass('move-up');
    $('.logo').addClass('high-logo');
  })


$('.find-tram').click(function() {
     // initiate_geolocation();

        findRoute();
        getDirections();
    
  })

$('.show-map').click(function() {
     $('#stop-directions').addClass('open')
    
  })

$('.close-map').click(function() {
     $('#stop-directions').removeClass('open')
    
  })


function findRoute() {
 $('#tram-times').html('');
 $('#nearest-stop').html(tramStops[sessionData.startStop].stopName).parent().addClass('fade-in');
  for(i = 0; i < Object.keys(tramStops[sessionData.startStop].stopRoutes).length; i ++) {
        route = (tramStops[sessionData.startStop].stopRoutes[i])
        route =  route.toString().toLowerCase();

        // TO GET RID OF

        var min = 0;
        var max = 15;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;


        $('#tram-times').append('<li class="'+ route +'"><span class="marker"></span>'+random +' minutes<i class="fa fa-clock-o right"></</li>')
    }
  $('#tram-times').addClass('fade-in');



// getMap(sessionData.startStop)


}


//   function getMap(closestStop) {
// initialize(closestStop)
// calcRoute()

//         }


// function initialize(closestStop) {
//     console.log(closestStop);
//    directionsService = new google.maps.DirectionsService();
// myLatlng = new google.maps.LatLng(sessionData.userLoc.split(",")[0],sessionData.userLoc.split(",")[1]);

// stopLatlng = new google.maps.LatLng(tramStops[closestStop].stopLat,tramStops[closestStop].stopLong);
//   directionsDisplay = new google.maps.DirectionsRenderer();
//   var mapOptions = {
//           center: myLatlng,
//           zoom: 24,
//           disableDefaultUI: true,
//           draggable: false  
//         };
//   map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
//   directionsDisplay.setMap(map);
// }

// function calcRoute() {

//   var request = {
//       origin: myLatlng,
//       destination: stopLatlng,
//       // Note that Javascript allows us to access the constant
//       // using square brackets and a string value as its
//       // "property."
//       travelMode: google.maps.TravelMode.WALKING
//   };
//   directionsService.route(request, function(response, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(response);
//     }
//   });
// }


function updateObject(obj,attr, value) {
    obj[attr] = value;
}

// Calculates Distance 

function calcDistance(lat1, lon1, lat2, lon2) 
    {
      var R = 3959; // miles
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }


//shows overlay 

(function() {
  var container = document.querySelector( 'div.container' ),
    triggerBttn = document.getElementById( 'trigger-overlay' ),
    overlay = document.querySelector( 'div.overlay' ),
    closeBttn = overlay.querySelector( '.overlay-close' );
    transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    support = { transitions : Modernizr.csstransitions };

  function toggleOverlay() {
    if( classie.has( overlay, 'open' ) ) {
      classie.remove( overlay, 'open' );
      classie.remove( container, 'overlay-open' );
      classie.add( overlay, 'close' );
      var onEndTransitionFn = function( ev ) {
        if( support.transitions ) {
          if( ev.propertyName !== 'visibility' ) return;
          this.removeEventListener( transEndEventName, onEndTransitionFn );
        }
        classie.remove( overlay, 'close' );
      };
      if( support.transitions ) {
        overlay.addEventListener( transEndEventName, onEndTransitionFn );
      }
      else {
        onEndTransitionFn();
      }
    }
    else if( !classie.has( overlay, 'close' ) ) {
      classie.add( overlay, 'open' );
      classie.add( container, 'overlay-open' );
    }
  }
  triggerBttn.addEventListener( 'click', toggleOverlay );
  closeBttn.addEventListener( 'click', toggleOverlay );
})();


//

$(document).ready(function() {
        setTimeout(function() {
            $('.logo').addClass('fade-in');
            setTimeout(function() {
                $('#journey-planner').addClass('fade-in');
            },  600);
        }, 800);
});

// maps directions
