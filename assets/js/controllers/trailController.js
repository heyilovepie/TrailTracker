main.controller('trailController', function($scope, $routeParams, dataProvider){
  dataProvider.getData(function(err, data){
      	if(!err){
        	angular.forEach(data, function(item, index){
        		if (item.id == $routeParams.trail){
  		  			$scope.type = item;
        		}
      		});
    	}
    });
});