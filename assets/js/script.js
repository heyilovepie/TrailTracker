$(function(){
	var 
        menuOptions = $("#menu #menu-options"),
        menuProfile = $("#menu #menu-profile"),
		menuOptionsToggle = $('#menu #menu-options .toggle button'),
        menuProfileToggle = $('#menu #toggle-profile button'),
		menuCatch = $('#menu .catch'),
        typeCatch = $('.type.catch'),
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
        menuOptions.trigger('hide');
    });

    menuProfileToggle.click(function(e){
        if(menuProfile.hasClass("open") && menuProfileToggle.hasClass("open")){ //if you are open
            menuProfileToggle.removeClass("open")
            setTimeout(function(){
                    menuProfile.removeClass("open");
                    menuProfileToggle.parent().removeClass("open");
            }, 600);
        }else if (menuProfile.hasClass("open") == false && menuProfileToggle.hasClass("open") == false){ //if you closed
            //this else if is here to stop you from opening when you are closing (stops everything from screwing up)
            menuProfile.addClass("open");
            menuProfileToggle.parent().addClass("open");
            setTimeout(function(){
                    menuProfileToggle.addClass("open");
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

    //////// POPUPS ////////////////////
	newRoute.click(function(){
		typeCatch.removeClass("hidden");
		menuOptions.trigger("hide");
	});

	$("#type-page .options button").click(function(){
		typeCatch.addClass("hidden");
	});

    typeCatch.click(function(e){
        if($(e.target).is(typeCatch)){
            typeCatch.addClass("hidden");
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

