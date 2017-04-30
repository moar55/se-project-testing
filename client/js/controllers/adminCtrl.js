main.controller("adminCtrl",['$scope','$http','Session','$location',function ($scope,$http,Session,$location) {
console.log('pfft admin');
  $("#admin_header").slideDown(500);
  $("#butts").hide();
  $scope.showList = function(){
    $("#butts").slideDown(200);
    $("#accept").slideUp(200);
  };
  $scope.remove_student = function(){
    $http.get('/api/students').success(function(res){
      $scope.stu = true;
      $scope.ser = false;
      $scope.eve = false;

      $scope.students = res;
    })
  };
  $scope.remove_sp = function(){
    $http.get('/api/service-providers').success(function(res){
      $scope.stu = false;
      $scope.ser = true;
      $scope.eve = false;

      $scope.sp = res;
    })
  };
  $scope.remove_event = function(){
    // $http.get('/api/students').success(function(res){
    //   $("#butts_st").slideUp(200);
    //   $("#butts_sp").slideUp(200);
    //   $("#butts_ev").slideDown(200);
    //
    //   $scope.events = res;
    // })
  };

  $scope.delete_student = function(student){
    $http.delete("/api/students/"+student).success(function(res){
      $scope.remove_student();
    })
  }
  $scope.delete_sp = function(sp){
    $http.delete("/api/service-providers/"+sp).success(function(res){
      $scope.remove_sp();
    })
  }
  $scope.delete_events = function(student){
    //$http.delete("/api/students/"+student).success(function(res){
      //$scope.remove_student();
    //})
  }


  $scope.showAccept = function(){
    $("#butts").slideUp(500);
    $("#accept").show();
    $http.get("/api/service-providers/potential").success(function(res){
      console.log(JSON.stringify(res));
      $scope.services = res;
      console.log($scope.services);
    })
  }
  $scope.accept_sp = function(sp){
    $http.get('api/service-providers/'+sp+'/acceptance').success(function(res){
      $scope.showAccept();
    });
  }
  $scope.reject_sp = function(sp){
    $http.delete('/api/service-providers/'+sp+'/reject').success(function(res){
      $scope.showAccept();
    });
  }
}]);
