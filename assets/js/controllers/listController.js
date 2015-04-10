main.controller('listController', function($scope, $routeParams, dataProvider){
	if(main.data == undefined){
	  	dataProvider.getData(function(err, data){
	      	if(!err){
	   			main.data = data;
	   			$scope.data = main.data;
	    	}
	    });
  	}
  	$scope.data = main.data;

  	//change format
  	$(".map-container").addClass("hidden");
  	$("#home").removeClass("hidden");

  	var list = $("#list-container");
  	var h = $(window).height();
	var w = $(window).width();

  	//hammer 
  	var listContainer = document.getElementById("list-container");
  	var listHammer = new Hammer(listContainer);

  	listHammer.get('pinch').set({ enable: true });
    listHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    listHammer.on("panup pandown", function(ev) {
        if( main.noPopups() ){
        	var top = list.offset().top;
        	var height = list.height();

            if( ev.type == "panup" ){ 
            	var move = -50;
            	if( ( top + height )  < h/2 ){ //if the bottom of the list is half off the page 
            		move = h/2 - ( top + height );
            	}
            	list.css({ top: top + move });
            }
            else if( ev.type == "pandown" ){ 
            	var move = 50;
            	if( top > 60 ){ //of the top of the page is on screen
            		move = 60 - top;
            	}
            	list.css({ top: top + move });
            }
        }
    });
});