main.controller("courseCtrl",['$scope','$http','$routeParams',function ($scope,$http,$routeParams) {
  var course={};
  $http.get('/api/service-providers/courses/id/'+$routeParams.id).success(function(res){
    console.log(res);
    course=res;
    $scope.course =course;
  })
  console.log("scope's course is "+JSON.stringify($scope.course)+" and normal is "+JSON.stringify(course))
  $scope.$parent.log=false;

  var take_course = function(){
    
  }

}]);
