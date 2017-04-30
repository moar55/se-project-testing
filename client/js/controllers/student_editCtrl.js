main.controller("student_editCtrl",['$route','$scope','$http','$routeParams','Session','$location',function($route,$scope,$http,$routeParams,Session,$location){
  if (Session.isLoggedIn()) {
      user = Session.isLoggedIn();
      $("#header").slideDown(500);
      $scope.zaza = user.username;
  } else {
      console.log('waaat!');
  }

  $http.get("/api/students/"+Session.isLoggedIn().username).then(function (res) {
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


  }).then(function (err) {
    $scope.error = JSON.stringify(err);
  });

  $scope.edit_submit = function(){

  var x ={
    firstName : $scope.firstName,
    lastName : $scope.lastName,
    school: $scope.school,
    email: $scope.email.toLowerCase(),
    nationality: $scope.nationality,
    mobileNumber :$scope.mobileNumber,
    img : $scope.img,
    age : $scope.age,

    };

var url = "/api/students/"+Session.isLoggedIn().username;
$http({
  method:"PUT",
  url:url,
  data:x ,
  headers:{'Content-Type':'application/x-www-form-urlencoded'}
}).then(function (res) {

    $scope.error = "Info edited!!";
    $location.path('/students/'+Session.isLoggedIn().username);
}).then(function (err) {
    $scope.error = JSON.stringify(err);
    $location.path('/students/'+Session.isLoggedIn().username);
});
  }
    $scope. add_interest =function(interest){

    $http.post("/api/students/"+Session.isLoggedIn().username+'/interests',{interestName:interest}).then(function (res) {

        $scope.error = "Interest Added!!";
          $location.path('/students/'+Session.isLoggedIn().username);

    }).then(function (err) {
      $scope.error = JSON.stringify(err);
        $location.path('/students/'+Session.isLoggedIn().username);

    });


  }
  $scope. delete_interest =function(interest_deleted){
  $http.delete("/api/students/"+Session.isLoggedIn().username+"/interests/"+interest_deleted).then(function(res){
      $scope.error = "Interest Deleted!!";
      $location.path('/students/'+Session.isLoggedIn().username);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
        $("#edit_general").hide();
          $location.path('/students/'+Session.isLoggedIn().username);

    });

  }
  $scope.cancel = function () {

        $location.path('/students/'+Session.isLoggedIn().username);
  }


}]);
