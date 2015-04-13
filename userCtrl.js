angular.module('userCtrl', [])
.controller('userController', function($scope, User){
  $scope.users = User.query(function(){

    switch ($scope.users[2]) {
      case "0":
        var diffStartTime = Date.now();
        var delta = $scope.users[1];
        var diffEndTime = Date.now();
        break;
      case "1":
        var diffStartTime = Date.now();
        var delta = jsondiffpatch.diff($scope.users[0], $scope.users[1]);
        var diffEndTime = Date.now();
        break;  
    }
    var sendTime = Date.now();

    var transmit = {
      "diffStartTime": diffStartTime,
      "diffEndTime": diffEndTime,
      "sendTime": sendTime,
      "delta": delta
    };
      console.log("patch="+JSON.stringify(delta).length);
      console.log("new data="+JSON.stringify($scope.users[1]).length);


    User.update(transmit, function() {
      $scope.mark = 'ok';
    });
  });
});


