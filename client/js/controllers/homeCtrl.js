main.controller("homeCtrl", ['$scope', '$http', "Session", function($scope, $http, Session) {
    if (Session.isLoggedIn()) {
        user = Session.isLoggedIn();
        $scope.$parent.log = false;
        $scope.zaza = user.username;
    } else {
        console.log('waaat!');
    }
}]);
