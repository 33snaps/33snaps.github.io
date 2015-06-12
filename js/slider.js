var app = angular.module('app', []);
app.controller('sliderCtrl', ['$scope', '$http', function($scope, $http){
	$scope.posts = [];
	$scope.currentImagePath = "";
	$scope.caption = "";
	$scope.description = "";
	$scope.currentIndex = 0;
	$scope.count = 0;
	$scope.showLoader = false;
	
	$http.get("data.json").success(function(response) {
    	$scope.posts = response;
    	$scope.count = response.length;
    	$scope.bindImage($scope.currentIndex);    	
    });

    $scope.bindImage = function(index){
    	if($scope.posts[index]){
	    	$scope.currentImagePath = "images/" + $scope.posts[index].image;
	    	$scope.caption = $scope.posts[index].headline;
			$scope.description = $scope.posts[index].body;
    	}
    };

    $scope.prev = function(){
		$scope.currentIndex--;
    };

    $scope.next = function(){
		$scope.currentIndex++;
    };

    $scope.handleLeftRightKeys = function ($event) {
    	if($event.keyCode === 37) { 
    		$scope.currentIndex-- ;
		} 
		else if($event.keyCode === 39) {
			$scope.currentIndex++; 
		}
    };

    $scope.$watch(function(){ return $scope.currentIndex;}, function(current, prev){
    	if(current < 0){
    		$scope.currentIndex = $scope.count + current;    		
    	}
    	else if(current > ($scope.count-1)){
    		$scope.currentIndex = current - $scope.count;
    	}
    	else{
    		$scope.bindImage(current);
    	}
    });    

    $scope.$watch(function(){ return $scope.currentImagePath;}, function(current, prev){    	
    	$scope.showLoader = true;
    });
}]);

app.directive('fadeIn', function($timeout){
    return {
        restrict: 'A',
        scope:{
    		showLoader: "=showLoader"
        },
        link: function($scope, $element, attrs){
            $element.addClass("ng-hide-remove");
            $element.on('load', function() {
            	$element.addClass("ng-hide-add");
                $scope.showLoader = false;
                $scope.$apply();
            });
        }
    }
});