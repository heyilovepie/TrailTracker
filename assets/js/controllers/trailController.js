main.controller('trailController', function($scope, $routeParams, dataProvider){
  if(main.data == undefined){
      dataProvider.getData(function(err, data){
          if(!err){
          main.data = data;
          $scope.data = main.data;
        }
      });
    }
    $scope.data = main.data;
    
    angular.forEach(main.data, function(item, index){
      if (item.id == $routeParams.trail){
        $scope.type = item;
      }
    });

    $(".map-container").addClass("hide");
});