main.controller("passResetCtrl",['$scope','$http','$routeParams','$location',function ($scope,$http,$routeParams,$location) {
  var type = $location.absUrl().split('/')[3];
  console.log($location.absUrl());
  $http.get("/api/"+type+"/password-reset&id="+$routeParams.id)
       .success(function (res) {
         console.log(res);
         if(res.success)
         $scope.valid = true;
       })

 $scope.submit = function () {
   if($scope.password != $scope.verify_password)
    return $scope.errors = "Password fields don't match!";
    $scope.errors = "";
   var x = {
     password:$scope.password,
     verify_password:$scope.verify_password
   }
    $http.post("/api/"+type+"/password-reset&id="+$routeParams.id,x)
          .success(function (res) {
            console.log(res);
            $location.path("/").replace();
            window.history.replaceState( null , "Home Page", $location.absUrl() );
            console.log(res);
          })
 }

}]);
