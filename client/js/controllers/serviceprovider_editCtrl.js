main.controller("serviceprovider_editCtrl",['$scope','$http','$routeParams','Session','$location',function($scope,$http,$routeParams,Session,$location){
  console.log('da route mate '+ $scope.username);

  if (Session.isLoggedIn()) {
       user = Session.isLoggedIn();
       $("#header").slideDown(500);
       $scope.zaza = user.username;
   } else {
       console.log('waaat!');
   }
    $http.get("/api/service-providers/"+$routeParams.businessName).then(function (res) {
          $scope.username = res.data.username;
          $scope.firstName = res.data.firstName;
          $scope.lastName = res.data.lastName;
          $scope.email = res.data.email ;
          $scope.nationality = res.data.nationality;
          $scope.age = res.data.age ;
          $scope.businessName = res.data.businessName ;
          $scope.skills = res.data.skills ;
          $scope.mobileNumber = res.data.mobileNumber ;
          $scope.courses = res.data.courses ;
          $scope.reviews = res.data.reviews;
          $scope.AverageRate(res.data.reviews);

    }).then(function (err) {
      $scope.error = JSON.stringify(err);
    });

  $scope.edit_submit = function(){
    console.log('ywo');
  var x ={
    firstName : $scope.firstName,
    lastName : $scope.lastName,
    businessName: $scope.businessName,
    email: $scope.email.toLowerCase(),
    nationality: $scope.nationality,
    mobileNumber :$scope.mobileNumber,
    age : $scope.age

    };

var url = "/api/service-providers/"+$scope.username;
    $http({
      method:"PUT",
      url:url,
      data:x ,
      headers:{'Content-Type':'application/x-www-form-urlencoded'}
    }).then(function (res) {
      console.log('oy1');
        $scope.error = "Info edited!!";
    }).then(function (err) {
      console.log('oy');
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+$routeParams.businessName);
    });
  };

  $scope.AverageRate= function(reviews){
    if(!reviews) return NaN;
    var sum = 0;
  for(var i = 0; i < reviews.length; i++){
      sum += Number(reviews[i].stars) //don't forget to add the base
  }

  var avg = sum/reviews.length;

  return avg;

  }



  $scope.add_Course =function(course){
    console.log(course);
    $http.post("/api/service-providers/"+Session.isLoggedIn().username+"/courses/",course).then(function(res){
      $scope.error = "Course Added!!";
      $location.path('/service-providers/'+$routeParams.businessName);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+$routeParams.businessName);
    });
  }



  $scope.delete_Course =function(course_deleted){
    console.log(course_deleted);
    $http.delete("/api/service-providers/"+Session.isLoggedIn().username+"/courses/"+course_deleted).then(function(res){
      $scope.error = "Course Deleted!!";
      $location.path('/service-providers/'+$routeParams.businessName);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+$routeParams.businessName);
    });

  }
  $scope.add_Skill =function(skill){
    console.log(skill);
    $http.post("/api/service-providers/"+Session.isLoggedIn().username+"/skills/",{skillName:skill}).then(function(res){
      $scope.error = "Skill Added!!";
      $location.path('/service-providers/'+$routeParams.businessName);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+$routeParams.businessName);
    });
  }

  $scope.delete_Skill =function(skill_deleted){
    console.log(skill_deleted);
    $http.delete("/api/service-providers/"+Session.isLoggedIn().username+"/skills/"+skill_deleted).then(function(res){
      $scope.error = "Skill Deleted!!";
      $location.path('/service-providers/'+$routeParams.businessName);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+$routeParams.businessName);
    });

  }
  $scope.cancel = function () {

      $location.path('/service-providers/'+$routeParams.businessName);

  }




}]);
