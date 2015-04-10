angular.module('userCtrl', [])
.controller('userController', function($scope, User){
  $scope.users = User.query(function(){
    
    console.log($scope.users[0]);
    console.log($scope.users[1]);
      
    var diffStartTime = Date.now();
    //use the jsondiffpacth to get a patch
    var delta = jsondiffpatch.diff($scope.users[0], $scope.users[1]);
    var diffEndTime = Date.now();
    
    console.log(delta);

    var sendTime = Date.now();

    var transmit = {
      "diffStartTime": diffStartTime,
      "diffEndTime": diffEndTime,
      "sendTime": sendTime,
      "delta": delta
    };

    User.update(transmit, function() {
      $scope.mark = 'ok';
    });
  });


});


