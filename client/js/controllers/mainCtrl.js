main.controller("mainCtrl", ['$scope','Session','$location',function ($scope,Session,$location) {
  $scope.log = true;
  $scope.body = {
    'background-image':'url("../img/bg_'+Math.floor(Math.random()*4)+'.jpeg")',
    'background-repeat' : 'no-repeat',
    'background-size' : 'cover',
    'transition-duration':'0.3s',
    'background-attachment': 'fixed'
  }
  $scope.loadProfile = function(){
    var user;
    if(user = Session.isLoggedIn()){
      $scope.log = false;
      console.log('the dude '+user.businessName);

      if(user.type==='Student'){
      $location.path("/students/"+user.username).replace();
      window.history.replaceState( null , "Student Profile", $location.absUrl() );
    }
    else{

      $location.path("/service-providers/"+user.businessName).replace();
      window.history.replaceState( null , "Service Provider Profile", $location.absUrl() );
    }
    }
    else{
      $location.path("/").replace();
      window.history.replaceState( null , "/", $location.absUrl() );
    }
  }

if(Session.isLoggedIn())
  $scope.user = Session.isLoggedIn().username;
  if($scope.user!=undefined)
  $scope.body = {
    'background-image':'none',
    'background': 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(200,200,200,1))',
    'background-repeat' : 'no-repeat',
    'background-size' : 'cover',
    'transition-duration':'0.3s',
    'background-attachment': 'fixed'
  }
}]);
