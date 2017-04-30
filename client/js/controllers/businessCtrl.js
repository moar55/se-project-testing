main.controller("businessCtrl",['$scope','$http','Session','$location',function ($scope,$http,Session,$location) {
  var billing={};
  if (Session.isLoggedIn()) {
      user = Session.isLoggedIn();
      $scope.billing = user.braintreeID;
      console.log("billing is "+user.braintreeID)
      $scope.$parent.user = user.businessName;
      $scope.$parent.log = false;
      $scope.zaza = user.username;
  }

  $scope.billing_info = function(){
    $scope.billing = true;
    var street_address= $scope.street_address;
    var locality = $scope._locality;
    var region = $scope.region;
    var postal_code = $scope.postal_code;
    var company_street_address= $scope.street_address;
    var company_locality = $scope._locality;
    var company_region = $scope.region;
    var company_postal_code = $scope.postal_code;
    billing={street_address:street_address,locality:locality,region,region,postal_code:postal_code,
    company_street_address:company_street_address,company_locality:company_locality,company_region,company_region,company_postal_code:company_postal_code
    ,dateOfBirth:$scope.birthdate};
    console.log(billing);
  }
  $scope.add_course = function(){
    var name=$scope.course_name;
    var description = $scope.course_description;
    var skill = $scope.skill;
    var price = $scope.price;
    var currency = $scope.currency;
    console.log("/api/service-providers/"+Session.isLoggedIn().username+"/courses");
    $http.post("/api/service-providers/"+Session.isLoggedIn().username+"/courses",{
      name : name, description : description, skill:skill, price : price, currency : currency, streetAddress:billing.street_address,
      locality:billing.locality, region:billing.region,postalCode:billing.postal_code,company_streetAddress:billing.company_street_address,
      company_locality:billing.company_locality, company_region:billing.company_region, company_postalCode:billing.company_postal_code})
    .success(function(res){
      console.log("I'm done momma! "+JSON.stringify(res));
    }).error(function(err){
      console.log(err);
    });
  }
  $scope.create_event = function(){
    var event_name = $scope.event_name;
    var event_description =$scope.desc+" : "+ $scope.event_description;
    var businessName = user.businessName;
    var date = $scope.date
    var all = {
      event_name : event_name,
      event_description : event_description,
      businessName : businessName,
      date : date
    }
    $http.post("/api/service-providers/"+user.username+"/events",all).success(function(res){
      console.log(all);
      console.log(res);
    })

  }

  var stars = function(ratings){
    var output = "";
    for(var i=0;i<5;i++){
      if(ratings){
        ratings--;
        output+='<img style="width:20%;height:20%;" src="../img/gold_star.png" >';
      }else output+='<img style="width:20%;height:20%;" src="../img/black_star.png" >';
    }
    return output;
  }
  var i_stars = function(ratings){
    var output = "";
    for(var i=0;i<5;i++){
      if(ratings){
        ratings--;
        output+='<i style="font-size:250%;" class="fa fa-star" aria-hidden="true"></i>';
      }else output+='<i style="font-size:250%;" class="fa fa-star-o" aria-hidden="true"></i>';
    }
    return output;
  }

  $http.get("/api/service-providers/"+user.businessName).success(function(res){
      $scope.courses=res.courses;

    //Add Reviews
    var sti = "";
    for(var i=res.reviews.length-1;i>-1;i--){
      var star = i_stars(res.reviews[i].stars);
      sti+='<p class="text-center"><h2>'+res.reviews[i].username+'</h2></p><p>'+star+'</p><p>'+res.reviews[i].text+'</p><hr>';
    }
    if(!res.reviews.length)
      sti='<p class="text-center">Sorry, no reviews for you ¯\\_(ツ)_/¯</p>'
    $("#reviews").html(sti);
  })
  .error(function(res){
    console.log("Error ya basha");
  });
}])
