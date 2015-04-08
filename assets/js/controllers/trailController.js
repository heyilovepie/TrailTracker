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

    $(".map-container").addClass("hidden");
    $("#home").removeClass("hidden");

    var check = $('#trail #trail-menu .button-holder#holder-check');

    check.click(function(){
      main.trail = $scope.type; //make the current trail be this trail
      main.addTrail(main.trail);
    });
});