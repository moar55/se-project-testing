main.controller("authCtrl",['$scope','$http','Session','$location',function ($scope,$http,Session,$location) {
       if(Session.isLoggedIn()){
         var name, type;
         switch(Session.isLoggedIn().type){
           case 'Student' : name='Student Homepage'; type = '/home';break;
           case 'ServiceProvider' : name='Business Homepage'; type = '/business';break;
           case 'Admin' : name = 'Admin Homepage';type = '/admin';break;
         }
         $location.path(type).replace();
         window.history.replaceState(null,name,$location.absUrl());
     }else {
           $("#businessName").hide();
           login_type = 'Student';
           type = 'Student';
           $("#unit").change(function(){
             if($("#unit").prop("checked")){
               type="ServiceProvider";
               $("#school").slideUp(200);
               $("#businessName").slideDown(200);
             }
             else{
               type="Student";
               $("#school").slideDown(200);
               $("#businessName").slideUp(200);
             }
           });
           $("#login_unit").change(function(){
             if($("#login_unit").prop("checked")){
               login_type="ServiceProvider";
             }
             else{
               login_type="Student";
             }
           });

           $scope.login_submit = function(){
             var x={username : $scope.login_username.toLowerCase(),password : $scope.login_password};
             if(login_type == 'Student'){
               $http.post("/api/students/login",x)
               .success(function (response, status, headers, config) {
                 Session.setLoggedIn(response.user);
                 window.history.replaceState( {} , "Homepage", "/home" );
                 $scope.$parent.body = {
                   'background-image':'none',
                   'background': 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(200,200,200,1))',
                   'background-repeat' : 'no-repeat',
                   'background-size' : 'cover',
                   'transition-duration':'0.3s',
                   'background-attachment': 'fixed'
                 }

               }).error(function (err) {
                 $scope.error_login = err.error;
               });
             }else{
               $http.post("/api/service-providers/login",x)
               .success(function (response, status, headers, config) {
                 console.log("The service provider in question is "+JSON.stringify(response))
                 Session.setLoggedIn(response.user);
                 window.history.replaceState( {} , "Business Homepage", "/business" );
                 $scope.$parent.log = false;
                 $scope.$parent.body = {
                   'background-image':'none',
                   'background': 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(200,200,200,1))',
                   'background-repeat' : 'no-repeat',
                   'background-size' : 'cover',
                   'transition-duration':'0.3s',
                   'background-attachment': 'fixed'
                 }
               }).error(function (err) {
                 $scope.error_login = err.error;
               });
             }

           }
           $scope.register_submit = function(){
             var x ={
               firstName : $scope.register_firstName,
               lastName : $scope.register_lastName,
               email: $scope.register_email.toLowerCase(),
               nationality: $scope.register_nationality,
               age : $scope.register_age,
               username: $scope.register_username.toLowerCase(),
               password: $scope.register_password,
               password2: $scope.register_password2
             };
             if(type=='Student'){
               x.school = $scope.register_school;
               $http.post("/api/students/register",x)
               .success(function (response, status, headers, config) {
                 Session.setLoggedIn(response.user);
                 window.history.replaceState( {} , "Homepage", "/home" );
                 $scope.$parent.body = {
                   'background-image':'none',
                   'background': 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(200,200,200,1))',
                   'background-repeat' : 'no-repeat',
                   'background-size' : 'cover',
                   'transition-duration':'0.3s',
                   'background-attachment': 'fixed'
                 }
               }).error(function (err) {
                 $scope.error_register = err.error;
               });
             }
             else {
               x.businessName = $scope.register_businessName;
               $http.post("/api/service-providers/register",x)
               .success(function (response, status, headers, config) {
                 $scope.error_register = "Registered!! Please wait for an admin to approve your request.";
               }).error(function (err) {
                 $scope.error_register = err.error;
               });
             }


         };


         $scope.reset_pass = function () {
           var url;
           if($('input[name=type]:checked', '#forgot_pass_form').val() == "student")
             url = "/api/students/forgot-password";
           else
             url = "/api/service-providers/forgot-password";

           $http.post(url,{email:$scope.email})
                 .success(function (res) {
                   if(res.response)
                    alert(res.response);
                 })
                 .error(function (err) {
                   console.log(err);
                   alert(err);
                 })
        }

         $scope.admin_submit = function(){
           var x;
             x ={username : $scope.admin_username.toLowerCase(),password : $scope.admin_password};
           $http.post("/api/admins/login",x)
           .success(function (response, status, headers, config) {
             Session.setLoggedIn(response.user);
             window.history.replaceState( {} , "Admin Homepage", "/admin" );
             $scope.error = "Loggged in!!";
           }).error(function (err) {
             $scope.error = JSON.stringify(err);
           });
         }

       }

}]);
