main.controller("student_profileCtrl",['$scope','$http','$routeParams' ,'Session','$location',function($scope,$http,$routeParams ,Session,$location){

    $http.get("/api/students/"+$routeParams.username).then(function (res) {
      $scope.username = res.data.username;
      $scope.firstName = res.data.firstName ;
      $scope.lastName = res.data.lastName  ;
      $scope.img = res.data.img ;
      $scope.email = res.data.email ;
      $scope.nationality = res.data.nationality;
      $scope.age = res.data.age ;
      $scope.school = res.data.school ;
      $scope.mobileNumber = res.data.mobileNumber   ;
      $scope.interestTags = res.data.interestTags ;
      $scope.courses = res.data.courses;

    }).then(function (err) {
      $scope.error = JSON.stringify(err);
    });


    if(Session.isLoggedIn().username == $routeParams.username)
      {
        $("#pencil").show();
        $("#pencil1").show();
      }
      else
      {
          $("#pencil").hide();
          $("#pencil1").hide();
      }
    $scope.edit_general = function () {

      $location.path('/student_edit');
  }
}]);
