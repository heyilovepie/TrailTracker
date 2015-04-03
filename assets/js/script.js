$(function(){
	var 
		menuToggle = $('#menu div.toggle button'),
		menuOverlay = $('#menu .overlay'),
		optionsOverlay = $('#type-overlay'),
		newRoute = $('#new-route'),
		optionsPopup = $("#type-page"),
		optionsPopup_p = optionsPopup.parent(),
		menuOptions = $("#menu-options");

	menuToggle.click(function(e){
		$(this).parent().toggleClass("open");
		$(this).parent().parent().toggleClass("open");
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