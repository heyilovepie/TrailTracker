$(function(){
	var 
		menuToggle = $('#menu div.toggle button'),
		overlay = $('.overlay');

	menuToggle.click(function(e){
		$(this).parent().toggleClass("open");
		$(this).parent().parent().toggleClass("open");
	});

	overlay.click(function(e){
		if($(e.target).is(overlay)){
			$(this).children().toggleClass("open");
		}
	})
/*
		dialog_p.click(function(e){
		// When the overlay is clicked, hide the dialog_p.
		if($(e.target).is('.overlay')){
			// This check is need to prevent
			// bubbled up events from hiding the dialog
			dialog_p.trigger('hide');
		}
	});
*/


});