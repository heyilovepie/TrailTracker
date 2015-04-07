main.controller('mainController', function($scope, $routeParams, dataProvider){
  	dataProvider.getData(function(err, data){
      if(!err && main.data == undefined){
        	main.data = data;
    	}
    });
    $(".map-container").removeClass("hide");
    $("#home").addClass("hidden");
});