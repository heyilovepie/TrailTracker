main.controller('trailController', function($scope, $routeParams, dataProvider){
  dataProvider.getData(function(err, data){
      	if(!err){
      		if(main.data == undefined){
      			main.data =  data;
      		}
        	angular.forEach(main.data, function(item, index){
        		if (item.id == $routeParams.trail){
  		  			$scope.type = item;
        		}
      		});
    	}
    });
});