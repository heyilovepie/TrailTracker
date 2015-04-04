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
  	$(".map-container").addClass("hide");
});