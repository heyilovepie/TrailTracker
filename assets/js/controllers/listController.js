main.controller('listController', function($scope, $routeParams, dataProvider){
  dataProvider.getData(function(err, data){
      	if(!err && main.data == undefined){
   			main.data = data;
    	}
    });
});