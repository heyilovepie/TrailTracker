main.controller('mainController', function($scope, $routeParams, dataProvider){
  dataProvider.getData(function(err, data){
      if(!err){
        $scope.data = data;
    	}
    });
});