var app = angular.module('app', ['ngRoute']).config(function($routeProvider){
    $routeProvider.when('/posts', {
        controller: 'SliderCtrl',
        templateUrl: 'views/slider.html'
    }).otherwise({redirectTo: '/posts'})
});
app.controller('SliderCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.posts = [];
    $scope.currentImagePath = "";
    $scope.caption = "";
    $scope.description = "";
    $scope.count = 0;
    $scope.showLoader = false;
    $scope.id = 0;

    $scope.$on('$routeUpdate', function () {
        $scope.bindImage();
    });

    $http.get("data.json").success(function (response) {
        $scope.posts = response;
        $scope.count = response.length;
        $scope.bindImage();
    });

    $scope.bindImage = function () {
        if ($scope.posts && $scope.posts.length > 0) {
            var queryObj = $location.search();
            $scope.id = (queryObj && queryObj.id) ? queryObj.id : $scope.posts[0].id;

            var post = getPostById($scope.id);
            if (post) {
                $scope.currentImagePath = "images/" + post.image;
                $scope.caption = post.headline;
                $scope.description = post.body;
            }
        }
    };

    $scope.prev = function () {
        var index = getPostIndexById($scope.id);
        $location.search({"id": index <= 0 ? $scope.posts[$scope.posts.length - 1].id : $scope.posts[index - 1].id});
    };

    $scope.next = function () {
        var index = getPostIndexById($scope.id);
        $location.search({"id": index >= ($scope.posts.length - 1) ? $scope.posts[0].id : $scope.posts[index + 1].id});
    };

    $scope.handleLeftRightKeys = function ($event) {
        if ($event.keyCode === 37) {
            $scope.prev();
        }
        else if ($event.keyCode === 39) {
            $scope.next();
        }
    };

    /*$scope.$watch(function () {
        return $scope.currentIndex;
    }, function (current, prev) {
        if (current < 0) {
            $scope.currentIndex = $scope.count + current;
        }
        else if (current > ($scope.count - 1)) {
            $scope.currentIndex = current - $scope.count;
        }
        else {
            $scope.bindImage(current);
        }
    });*/

    $scope.$watch(function () {
        return $scope.currentImagePath;
    }, function (current, prev) {
        $scope.showLoader = true;
    });

    function getPostById(id) {
        id = +id;
        for (var i = 0, len = $scope.posts.length; i < len; i++) {
            if($scope.posts[i].id === id){
                return $scope.posts[i];
            }
        }
        return null;
    }

    function getPostIndexById(id) {
        for (var i = 0, len = $scope.posts.length; i < len; i++) {
            if($scope.posts[i].id === id){
                return i;
            }
        }
        return 0;
    }
}]);

app.directive('fadeIn', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            showLoader: "=showLoader"
        },
        link: function ($scope, $element, attrs) {
            $element.addClass("ng-hide-remove");
            $element.on('load', function () {
                $element.addClass("ng-hide-add");
                $scope.showLoader = false;
                $scope.$apply();
            });
        }
    }
});