var profile = angular.module("profile", ["ngRoute","angularFileUpload"]);

profile.controller("usernameCtrl",["$scope","$http","$routeParams",function ($scope,$http,$routeParams) {
  console.log('yoo boooys');
  //$http.get("api/serviceProviders/"+user.username)
 //.then(function (response) {$scope.username = user.username;},function(err){$scope.x='error';} );
  $scope.username = $routeParams.username;
  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableUsername = $scope.username;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.username = $scope.editableUsername;
    $scope.disableEditor();
  };
}]);

profile.controller("businessnameCtrl",function ($scope,$http,$routeParams) {
//  $http.get("/api/serviceProviders/"+user.businessName)
  //.then(function (response) {$scope.businessName = user.businessName;},function(err){$scope.x='error';});

$scope.businessName = $routeParams.businessName;

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableBusinessname = $scope.businessName;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.businessName = $scope.editableBusinessname;
    $scope.disableEditor();
  };
});
profile.controller("nationalityCtrl",function ($scope,$http,$routeParams) {
//  $http.get("/api/serviceProviders/"+user.nationality)
//  .then(function (response) {$scope.nationality = user.nationality;},function(err){$scope.x='error';});
$scope.nationality = $routeParams.nationality;

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableNationality = $scope.nationality;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.nationality = $scope.editableNationality;
    $scope.disableEditor();
  };
});
profile.controller("skillCtrl",function ($scope,$http,$routeParams) {
  //$http.get("/api/serviceProviders/"+user.skills)
  //.then(function (response) {$scope.skills = user.skills;},function(err){$scope.x='error';});

$scope.skills = $routeParams.skills;

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableSkill = $scope.skills;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.skills = $scope.editableSkill;
    $scope.disableEditor();
  };
});
profile.controller("ageCtrl",function ($scope,$http,$routeParams) {
//  $http.get("/api/serviceProviders/"+user.age)
//  .then(function (response) {$scope.age = user.age;},function(err){$scope.x='error';});

  $scope.age = $routeParams.age;

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableAge = $scope.age;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.age = $scope.editableAge;
    $scope.disableEditor();
  };
});
profile.controller("mobilenumberCtrl",function ($scope,$http,$routeParams) {
//  $http.get("/api/serviceProviders/"+user.mobileNumber)
//  .then(function (response) {$scope.mobileNumber = user.mobileNumber;},function(err){$scope.x='error';});

$scope.mobileNumber = $routeParams.mobileNumber;


  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableMobilenumber = $scope.mobileNumber;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.mobileNumber = $scope.editableMobilenumber;
    $scope.disableEditor();
  };
});
profile.controller("emailCtrl",function ($scope,$http,$routeParams) {
  //$http.get("/api/serviceProviders/"+user.email)
  //.then(function (response) {$scope.email = user.email;},function(err){$scope.x='error';});

  $scope.email = $routeParams.email;


  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableEmail = $scope.email;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.email = $scope.editableEmail;
    $scope.disableEditor();
  };
});
profile.controller("courseCtrl",function ($scope,$http,$routeParams) {
//  $http.get("/api/serviceProviders/"+user.course)
//  .then(function (response) {$scope.course = user.course;},function(err){$scope.x='error';});


$scope.course = $routeParams.course;


  $scope.addCourse = function(){
    $scope.course.push($scope.newcourse);
    $scope.newcourse = "";
  };

  $scope.editorEnabled = false;

  $scope.enableEditor = function() {
    $scope.editorEnabled = true;
    $scope.editableCourse = $scope.course;
  };

  $scope.disableEditor = function() {
    $scope.editorEnabled = false;
  };

  $scope.save = function() {
    $scope.course = $scope.editableCourse;
    $scope.disableEditor();
  };

  profile.controller("reviewsCtrl",function ($scope,$http,$routeParams) {

$scope.reviews = $routeParams.reviews;

    $scope.editorEnabled = false;

    $scope.enableEditor = function() {
      $scope.editorEnabled = true;
      $scope.editableReviews = $scope.reviews;
    };

    $scope.disableEditor = function() {
      $scope.editorEnabled = false;
    };

    $scope.save = function() {
      $scope.reviews = $scope.editableReviews;
      $scope.disableEditor();
    };
  });
