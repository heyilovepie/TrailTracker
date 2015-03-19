$(function(){
	var menuToggle = $('#menu div.toggle button');

	menuToggle.click(function(e){
		$(this).parent().toggleClass("open"); //this is not working yet
		$(this).parent().parent().toggleClass("open");
	});
});