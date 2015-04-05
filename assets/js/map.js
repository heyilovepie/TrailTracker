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






$(document).ready(function(){

    function success(position) {
      var coordLat = position.coords.latitude;
      var coordLong = position.coords.longitude;

      console.log("in success");

    // var coordLat = 49.2764031;
    // var coordLong = -123.0979068;

      // var coordLat = position.coords.latitude;
      // var coordLong = position.coords.longitude;

    // var coordLat = 49.2764031;
    // var coordLong = -123.0979068;

        var map = new GMaps({
            div: '#map',
            lat: coordLat, 
            lng: coordLong,
            zoom: 11,
            options: {
                scrollwheel: false,
                navigationControl: false,
                mapTypeControl: false,
                disableDefaultUI: true,
                styles: bwStyles
            },
            click: function(e){
                alert("yeahhhh")
            }
        })
    };

    function error(msg) {
      alert('error: ' + msg);
    };

    if (navigator.geolocation) {
        console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition(success, error); //this is not working!!!
    } else {
      alert('geolocation not supported');
    }
});