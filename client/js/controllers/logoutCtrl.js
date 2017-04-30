main.controller("logoutCtrl", ['$location','Session','$http','$scope',function ($location,Session,$http,$scope) {

$scope.leave = function () {
  $scope.$parent.body = {
    'background-image':'url("../img/bg_'+Math.floor(Math.random()*4)+'.jpeg")',
    'background-repeat' : 'no-repeat',
    'background-size' : 'cover',
    'transition-duration':'0.3s'
  }
  Session.logout();
  $http.get("/api/logout")
  .success(function (data) {
    $location.path("/").replace();
    $scope.$parent.log = true;
    window.history.replaceState( null , "/", $location.absUrl() );
  })
  }

}]);
