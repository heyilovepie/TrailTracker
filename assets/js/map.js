var bwStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 26
            },
            {
                "color": "#425260"
            },
            {
                "lightness": 0
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 51
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 30
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 40
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    }
]

main.geoLocate = function( passedFunction ){
    GMaps.geolocate({
      success: function(position) {
        //set global variables
        main.location = {};
        main.location.lat =  position.coords.latitude;
        main.location.lng =  position.coords.longitude;
        //console.log( "This location is " + main.location.lat + " lat by " + main.location.lng + " lng." );
        passedFunction();
      },
      error: function(error) {
        alert('Geolocation failed: '+error.message);
      },
      not_supported: function() {
        alert("Your browser does not support geolocation");
      },
      always: function() {
      }
    });
};

$(document).ready(function(){
    main.map = new GMaps({
        div: '#map',
        lat: 49.2764031, 
        lng: -123.0979068,
        zoom: 11,
        options: {
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            disableDefaultUI: true,
            styles: bwStyles
        },
        click: function(e){
            //console.log("clicking on map");
        }
    })

    main.setCenterMap = function(){
        /* set the center of the map to  be your location */
        main.map.setCenter(main.location.lat, main.location.lng);
    }

    function getLocation(){
        var x = function(){};
        main.geoLocate( x );
        if( main.loopGetLocation ){ //allows you to break the link
            setInterval( getLocation, 3000); //get location every 3 seconds
        }
    };

    main.getLocationAndSetCenter = function(){
        /* set the center the first time */
        main.geoLocate( main.setCenterMap );
        setInterval( getLocation, 3000); //get location every 3 seconds
    };

    main.loopGetLocation = true;
    main.getLocationAndSetCenter();
});