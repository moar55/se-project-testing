main.controller("searchCtrl",['$scope','$http',function ($scope,$http) {

      $scope.search = function(){
        document.getElementById("query_result").innerHTML = "";
        console.log($('input[name=type]:checked', '#search-form').val());
        if($('input[name=type]:checked', '#search-form').val() == "student"){
          var first = "";
          var second = "";

          var name = $scope.query.split(" ");

          if($scope.query=="")
            return $http.get('/api/students').then(function(res){
                $scope.result = res;
                populate(res.data,"student");
              });

            var url;
          if(name.length>0){
            if(name.length>1)
              url = '/api/students?firstName='+name[0]+'&lastName='+name[1];
            else {
              url = '/api/students?firstName='+name[0];
              console.log(url + ' yeaah');

            }

            $http.get(url).then(function(res){
              $scope.result = res.data;
              populate(res.data,"student");

            });
          }

        }

        else if($('input[name=type]:checked', '#search-form').val() == "serviceProvider"){
          $http.get('/api/service-providers/'+($scope.query||"")  ).then(function(res){
            console.log(res.data);
            $scope.result = res.data;
            populate(res.data,"serviceProvider");
          });
        }else{
          $http.get('/api/service-providers/courses/'+$scope.query.toUpperCase()).success(function(res){
            console.log("Courses: "+JSON.stringify(res));
            populate(res,"course");
          }).error(function(err){
            console.log(err);
          })
        }
      }

      function populate(data,type){ // malo jquery? :D
        var url ;
        if(type=="serviceProvider" && $scope.query!= ""){
           url = "service-providers/"+data.businessName;
           $("#query_result").html($("#query_result").html()+'<div class="well">'+'<a target="_self" class href="'+url+'"><h3>'+data.businessName+'</h3></a></div>');
        }
        else{
        for(var value of data){
        if(type == "student"){
          url = "students/"+value.username;
          $("#query_result").html($("#query_result").html()+'<div class="well">'+'<a target="_self" class href="'+url+'"><h3>'+value.firstName+' '+value.lastName+'</h3></a></div>');
        }
        else if(type=="serviceProvider") {
          url = "service-providers/"+value.businessName;
          $("#query_result").html($("#query_result").html()+'<div class="well">'+'<a target="_self" class href="'+url+'"><h3>'+value.businessName+'</h3></a></div>');
        }
        else{
          console.log("hey courses search");
          url = "courses/"+value._id;
          console.log(value);
          $("#query_result").html($("#query_result").html()+'<div class="well">'+'<a target="_self" class href="'+url+'"><h3>'+value.name+" by: "+value.businessName+'</h3></a></div>');
        }
        }
    }
  }

}]);
