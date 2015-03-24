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

    ////////// MENU ////////////////////

	menuOptionsToggle.click(function(e){
		menuOptions.trigger('switch');
	});

    menuProfileToggle.click(function(e){
        menuProfile.toggleClass("open");
    });

	menuCatch.click(function(e){
        menuOptions.trigger('hide');
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
});

