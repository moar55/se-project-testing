main.controller("forgotPassCtrl",['$scope','$http','$routeParams','$location',function ($scope,$http,$routeParams,$location) {
  $scope.reset_pass = function () {
    if($('input[name=type]:checked', '#forgot_pass_form').val() == "student")
      url = "/api/students/forgot-password";
    else
      url = "/api/service-providers/forgot-password";
    $scope.post(url,{email:$scope.email})
          .success(function (res) {
            if(res.response){
              alert(JSON.stringify(res.response))
              window.history.replaceState( {} , "Admin Homepage", "/" );
            }

          })
          .error(function (err) {
            alert(err);
          })
 }

}]);
