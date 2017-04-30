main.controller('newsCtrl',['$scope','$http','Session',function($scope,$http,Session){
    if (Session.isLoggedIn()) {
        user = Session.isLoggedIn();
        $scope.$parent.user = user.username;
        $scope.$parent.log = false;
        $scope.zaza = user.username;
    } else {
        console.log('waaat!');
    }

   $http.get('../api/students/news').then(function(res){
     console.log(res);
     //console.log(res.data);
     $scope.topics=res.data.news;
   },function(err){
     $scope.topics="Error";
   });
}]);
