$(function(){
	var 
        menuOptions        = $("#menu #menu-options"),
        menuProfile        = $("#menu #menu-profile"),

		menuOptionsToggle  = $('#menu #menu-options .toggle button'),
        menuProfileToggle  = $('#menu #toggle-profile button'),

        newRoute           = $('#new-route');

		menuCatch          = $('#menu .catch'),
        typeCatch          = $('.type.catch'),
        trailCatch         = $('.trail.catch'),

        startPage          = $("#start-page"),
        typePage           = $('#type-page'),
        trailPage          = $('#trail-page'),

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
        if( menuProfile.hasClass("open") && menuProfileToggle.hasClass("open") ){ //if you are open
            menuProfileToggle.removeClass("open");
            setTimeout(function(){
                    menuProfile.removeClass("open");
                    menuProfileToggle.parent().removeClass("open");
            }, 600);
        }else if ( menuProfile.hasClass("open") == false && menuProfileToggle.hasClass("open") == false ){ //if you closed
            menuProfile.addClass("open");
            menuProfileToggle.parent().addClass("open");
            setTimeout(function(){
                    menuProfileToggle.addClass("open");
            }, 600);
        }
    }).on("show", function(){
        if ( menuProfile.hasClass("open") == false && menuProfileToggle.hasClass("open") == false ){ //if you closed
            menuProfile.addClass("open");
            menuProfileToggle.parent().addClass("open");
            setTimeout(function(){
                    menuProfileToggle.addClass("open");
            }, 600);
        }
    }).on("hide", function(){
        if( menuProfile.hasClass("open") && menuProfileToggle.hasClass("open") ){ //if you are open
            menuProfileToggle.removeClass("open");
            console.log("remove open class");
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

    var noPopups =  function(){
        /* returns true if there are no popups */
        if( startPage.hasClass("hidden") && typePage.hasClass("hidden") && trailPage.hasClass("hidden")) return true;
        else return false;
    };


    /*==========================================
                    CLICKING
    ============================================*/

    var 
        mProfile = document.getElementById("menu-profile"),
        mOptions = document.getElementById("menu-options"),
        mOptionsCatch = document.getElementById("options-catch");

    //hammer elements
    var 
        profHammer = new Hammer(mProfile),
        optHammer  = new Hammer(mOptions),
        optCatchHammer  = new Hammer(mOptionsCatch);


    // listen to events...
    profHammer.on("panright", function(ev) {
        //close profile menu
        if( noPopups() ){
            if((menuProfile.hasClass("open") && menuProfileToggle.hasClass("open")) ){
                ev.preventDefault();
                menuProfileToggle.removeClass("open");
                setTimeout(function(){
                    menuProfile.removeClass("open");
                    menuProfileToggle.parent().removeClass("open");
                }, 600);
            }
        }
    });

    //close option menu
    optHammer.on("panleft", function(ev) {
        if( noPopups() ){
            if( menuOptions.hasClass( "open" ) ){
                ev.preventDefault();
                menuOptions.removeClass("open");
                menuOptions.children().removeClass("open");
                menuCatch.addClass("hidden");
            }
        }
    });
    optCatchHammer.on("panleft", function(ev) {
        if( noPopups() ){
            if( menuOptions.hasClass( "open" ) ){
                ev.preventDefault();
                menuOptions.removeClass("open");
                menuOptions.children().removeClass("open");
                menuCatch.addClass("hidden");
            }
        }
    });
});

