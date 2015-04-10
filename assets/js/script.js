$(function(){
	var 
        menuOptions = $("#menu #menu-options"),
        menuProfile = $("#menu #menu-profile"),
		menuOptionsToggle = $('#menu #menu-options .toggle button'),
        menuProfileToggle = $('#menu #toggle-profile button'),
		menuCatch = $('#menu .catch'),
        typeCatch = $('.type.catch'),
        typePage = $('#type-page'),
        trailPage = $('#trail-page'),
        trailCatch = $('.trail.catch');
		newRoute = $('#new-route'),
		optionsPopup = $("#type-page");

    /*==========================================
                    CLICKING
    ============================================*/

    ////////// MENU ////////////////////
	menuOptionsToggle.click(function(e){
		menuOptions.trigger('switch');
	});

    menuCatch.click(function(e){
        /* any popup catch clicked will close the menu options */
        menuOptions.trigger('hide');
    });

    menuProfileToggle.click(function(e){
        menuProfile.trigger("toggle");
    });

    menuProfile.on("toggle", function(){
        if(menuProfile.hasClass("open") && menuProfileToggle.hasClass("open")){ //if you are open
            menuProfileToggle.removeClass("open")
            setTimeout(function(){
                    menuProfile.removeClass("open");
                    menuProfileToggle.parent().removeClass("open");
            }, 600);
        }else if (menuProfile.hasClass("open") == false && menuProfileToggle.hasClass("open") == false){ //if you closed
            menuProfile.addClass("open");
            menuProfileToggle.parent().addClass("open");
            setTimeout(function(){
                    menuProfileToggle.addClass("open");
            }, 600);
        }
    }).on("show", function(){
        if (menuProfile.hasClass("open") == false && menuProfileToggle.hasClass("open") == false){ //if you closed
            menuProfile.addClass("open");
            menuProfileToggle.parent().addClass("open");
            setTimeout(function(){
                    menuProfileToggle.addClass("open");
            }, 600);
        }
    }).on("hide", function(){
        if(menuProfile.hasClass("open") && menuProfileToggle.hasClass("open")){ //if you are open
            menuProfileToggle.removeClass("open")
            setTimeout(function(){
                    menuProfile.removeClass("open");
                    menuProfileToggle.parent().removeClass("open");
            }, 600);
        }
    });

    menuOptions.on('hide',function(){
        menuOptions.removeClass("open");
        menuOptions.children().removeClass("open");
        menuCatch.addClass("hidden");
    }).on('show',function(){
        menuOptions.addClass("open");
        menuOptions.children().addClass("open");
        menuCatch.removeClass("hidden");
    }).on('switch',function(){
        menuOptions.toggleClass("open");
        menuOptions.children().toggleClass("open");
        menuCatch.toggleClass("hidden");
    });

    /////// OPTIONS /////////////////
    $(".options-button").click(function(){
        setTimeout(function(){
            menuOptions.trigger("hide");
        }, 100);
    });

    newRoute.click(function(){
        typeCatch.removeClass("hidden");
        typePage.removeClass("hidden");
    });

    //////// POPUPS ////////////////////
	$("#type-page .options .button").click(function(){
		typeCatch.addClass("hidden");
        typePage.addClass("hidden");
	});
    
    $("#trail-page .button").click(function(){
        trailCatch.addClass("hidden");
        trailPage.addClass("hidden");
    });

     $("#trail-page .option").click(function(){
        trailCatch.addClass("hidden");
        trailPage.addClass("hidden");
    });

    typeCatch.click(function(e){
        //close popup if catch is pressed
         typeCatch.addClass("hidden");
         typePage.addClass("hidden");
    });

    trailCatch.click(function(e){
        //close popup if catch is pressed
        if($(e.target).is(trailCatch)){
            trailCatch.addClass("hidden");
            trailPage.addClass("hidden");
        }
    });

    /*==========================================
                    CLICKING
    ============================================*/

    /*
    var menuOptionsH = new Hammer(menuOptions, { multiUser: true });
    menuOptionsH.get('swipe').set({enable:true});
    menuOptionsH.on('swipe', function(ev){
        ev.preventDefault();
        menuProfile.toggleClass("open");
    });
    */

    function addHammer(el) {
        var mc = new Hammer(el, { multiUser: true });
        mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        mc.get('pinch').set({ enable: true });
        mc.get('rotate').set({ enable: true });

        mc.on("swipe pan press pinch rotate tap doubletap", function (ev) {
            ev.preventDefault();
        });
    }
});

