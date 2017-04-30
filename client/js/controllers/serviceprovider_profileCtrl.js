main.controller("serviceprovider_profileCtrl",['$scope','$http','$routeParams','Session','$location',function($scope,$http,$routeParams,Session,$location){
  console.log('da route mate '+ $routeParams.businessName);
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


    $scope.AverageRate= function(reviews){
      if(!reviews) return NaN;
      var sum = 0;
    for(var i = 0; i < reviews.length; i++){
        sum += Number(reviews[i].stars) //don't forget to add the base
    }

    var avg = sum/reviews.length;

    return avg;

    }

    if(Session.isLoggedIn().businessName == $routeParams.businessName)
      {
        $("#pencil").show();
        $("#review").hide();

      }
      else
      {
          $("#pencil").hide();
          $("#review").show();

      }
    $scope.edit_general = function () {
      $location.path('/ServiceProvider_edit/'+$routeParams.businessName);

  }
  $scope.add_Review =function(review,stars){
    console.log(review);
    if(Session.isLoggedIn().type == "Student"){
    $http.post("/api/service-providers/"+$scope.username+"/reviews",{text:review ,stars:stars}).then(function(res){
      $scope.error = "Review Added!!";
      $location.path('/service-providers/'+Session.isLoggedIn().businessName);
    }).then(function (err){
      $scope.error = JSON.stringify(err);
      $location.path('/service-providers/'+Session.isLoggedIn().businessName);
    });
  }
  else {
    alert("you aren't a student!");
  }

  }
  $scope.follow = function () {
     if(Session.isLoggedIn().type == "Student"){

     $http({method:"POST",
           url:"/api/students/"+Session.isLoggedIn().username+"/follow",
           data:  {typeOf:1,user:$routeParams.businessName},
           headers:{'Content-Type':'application/x-www-form-urlencoded'}
         })
           .then(function (res) {
     }).then(function(err) {
       $location.path('/service-providers/'+Session.isLoggedIn().businessName);

     })
   }
     else {
       alert("you aren't a student!");
     }
 }


}]);
