$(function(){
	var 
		menuOptionsToggle = $('#menu #menu-options .toggle button'),
        menuProfileToggle = $('#menu #toggle-profile button'),
		menuOverlay = $('#menu .overlay'),
		optionsOverlay = $('#type-overlay'),
		newRoute = $('#new-route'),
		optionsPopup = $("#type-page"),
		optionsPopup_p = optionsPopup.parent(),
		menuOptions = $("#menu-options");

	menuOptionsToggle.click(function(e){
		$(this).parent().toggleClass("open");
		$(this).parent().parent().toggleClass("open");
        //optionsOverlay.addClass("hidden");
	});

    menuProfileToggle.click(function(e){
        console.log("dhfasdfs");
        $("#menu #menu-profile").toggleClass("open");
    });

	menuOverlay.click(function(e){
		if($(e.target).is(menuOverlay)){ //if you've clicked on the overlay part (not the menu)
			var target = $(this).children(menuOptions);
			if(target.hasClass("open")){ 
				target.removeClass("open");
				target.children(".toggle").removeClass("open");
			}
		}
	});

	optionsOverlay.click(function(e){
		if($(e.target).is(optionsOverlay)){ //if you've clicked on the overlay part (not the menu)
			$(this).toggleClass("hidden");
		}
	});

	newRoute.click(function(){
		optionsPopup_p.toggleClass("hidden");
		menuOptions.removeClass("open");
		menuOptions.children(".toggle").removeClass("open");
	});

	$(".options button").click(function(){
		optionsPopup_p.toggleClass("hidden");
	});
});

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
    var map = new GMaps({
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
            alert("yeahhhh")
        }
    });
});