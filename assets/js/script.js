$(function(){
	var 
		menuToggle = $('#menu div.toggle button'),
		menuOverlay = $('#menu .overlay'),
		optionsOverlay = $('#type-overlay'),
		newRoute = $('#new-route')
		optionsPopup = $("#type-page");
		optionsPopup_p = $("#type-page").parent();

	menuToggle.click(function(e){
		$(this).parent().toggleClass("open");
		$(this).parent().parent().toggleClass("open");
	});

	menuOverlay.click(function(e){
		if($(e.target).is(menuOverlay)){ //if you've clicked on the overlay part (not the menu)
			var target = $(this).children("#menu-options");
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
	});


});