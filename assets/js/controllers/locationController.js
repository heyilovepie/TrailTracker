main.controller('locationController', function($scope, $routeParams, dataProvider){
  	dataProvider.getData(function(err, data){
      	if(!err && main.data == undefined){
       		main.data = data;
    	}
    });
    $(".map-container").addClass("hidden");
    $("#home").removeClass("hidden");
});