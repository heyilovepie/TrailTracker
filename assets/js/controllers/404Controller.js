main.controller('404Controller', function($scope, $routeParams, dataProvider){
	$(".map-container").addClass("hidden");
	console.log("first");
	$scope.message = "Something seriously screwed up...";
	$scope.rand = parseInt(Math.random()* 10);
	if($scope.rand < 1){
		$scope.message = "This is not the page you are looking for.";
	}else if ($scope.rand < 2){
		$scope.message = "Meow meow meow. Page is gone.";
	}else if ($scope.rand < 3){
		$scope.message = "What. An. Idiot."
	}else{
		$scope.message = "... ...too lazy to be funny."
	}

	$("#home").removeClass("hidden");
});