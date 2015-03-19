$(function(){
	var 
		menuToggle = $('#menu div.toggle button'),
		overlay = $('.overlay');

	menuToggle.click(function(e){
		$(this).parent().toggleClass("open");
		$(this).parent().parent().toggleClass("open");
	});

	overlay.click(function(e){
		if($(e.target).is(overlay)){ //if you've clicked on the overlay part (not the menu)
			var target = $(this).children("#menu-options");
			for(var i = 0; i < 2; i++){ //loop twice each with  a different target
				if(target.hasClass("open")){ 
					target.removeClass("open");
					target.children(".toggle").removeClass("open");
				}
				target = $(this).children("#menu-profile");
			}	
		}
	})
});