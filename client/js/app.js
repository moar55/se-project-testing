var type;

var main = angular.module("main", ["ngAnimate", "ngRoute","ngCookies"])

.config(['$httpProvider','$locationProvider','$routeProvider',
function($httpProvider,$locationProvider,$routeProvider){
  console.log('in here boyyyy woooooo');

  $httpProvider.defaults.transformRequest = function(data) {
        if (data === undefined) { return data; }
        return $.param(data);
  };
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  $locationProvider.html5Mode(true);

  $routeProvider.when('/',{
    templateUrl : "../views/login_register.html",
    controller : "authCtrl"
  })
  .when('/home',{
    templateUrl : "../views/news.html",
    controller : "newsCtrl"
  })
  .when('/admin',{
    templateUrl : "../views/admin.html",
    controller : "adminCtrl"
  })
  .when('/students/password-reset&id=:id',{
    templateUrl : "../views/password-reset.html",
    controller: "passResetCtrl"
  })
  .when('/service-providers/password-reset&id=:id',{
    templateUrl : "../views/password-reset.html",
    controller: "passResetCtrl"
  })
  .when('/students/:username',{
    templateUrl : "../views/student_profile.html",
    controller : "student_profileCtrl"
  })
  .when('/student_edit',{
    templateUrl: "../views/student_edit.html",
    controller:'student_editCtrl'
  })
  .when('/courses/:id',{
    templateUrl : "../views/course.html",
    controller : "courseCtrl"
  })
  .when('/test',{
    templateUrl: "../views/test.html",
    controller:'paymentCtrl'
  })
  .when('/business',{
    templateUrl : "../views/business.html",
    controller : "businessCtrl"
  })
  .when('/service-providers/:businessName',{
    templateUrl : "../views/serviceprovider_profile.html",
    controller : "serviceprovider_profileCtrl"
  })
  .when('/ServiceProvider_edit/:businessName',{
    templateUrl: "../views/serviceprovider_edit.html",
    controller:'serviceprovider_editCtrl'
  })
  .when('/forgot-your-pass',{
    templateUrl:"../views/forgot-pass.html",
    controller: "forgotPassCtrl.js"
  })
  .otherwise({redirectTo:'/home'});  //Add the when for students and service-providers
}])

// Use this in your controller to ensure authentication...
.factory('Session',['$cookies',function ($cookies) {
console.log('yooo');
  return {
  isLoggedIn: function () {
    console.log('da cookie boy '+JSON.stringify($cookies.getObject('user')));
    return $cookies.getObject('user');
  },
  setLoggedIn: function (user) {
    $cookies.putObject('user',user)
    window.user = user;
  },
  logout: function () {
    $cookies.remove('user');
    window.history.replaceState( {} , "Login", "/" );
  }
}
}])



// .run(['$rootScope','$location','Session',function ($rootScope, $location,Session) {
//   $rootScope.$on('$routeChangeStart',function (event) {
//     console.log('oy boy');
//     if(!Session.isLoggedIn()){
//       console.log('nop');
//       event.preventDefault();
//       $location.path('/login')
//     }else if($location.path()=='/'){
//       event.preventDefault();
//       $location.path('/home');
//     }
//   })
// }])


//
// main.config(['$http',function($http){
//   $http.get('/status',function(res){
//     user= res.data;
//   })
// }]);
