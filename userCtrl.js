angular.module('userCtrl', [])
.controller('userController', function($scope, User){
   $scope.sendPara = function(){
      
      var parameter = {
      "size": $scope.size,
      "probability": $scope.probability,
      "loopTimes": $scope.loopTimes,
      "algorithm": $scope.algorithm
      };
      
      var clear = function(){
        $scope.size=null;
        $scope.probability=null;
        $scope.loopTimes=null;
        $scope.algorithm=null;
      };
    
      //clear the mark
      $scope.mark=null;

      $scope.users = User.query(parameter, function() {
          
          

          var diffStartTime = Date.now();
          switch ($scope.algorithm) {
            case "0":
              var delta = $scope.users[1];
              break;
            case "1":
              var delta = jsondiffpatch.diff($scope.users[0], $scope.users[1]);
              break;  
          }
          var diffEndTime = Date.now();

          //todosomething
          var sendTime = Date.now();

          var transmit = {
            "diffStartTime": diffStartTime,
            "diffEndTime": diffEndTime,
            "sendTime": sendTime,
            "delta": delta
          };
          
          if(delta == undefined) {
            //if there is no modification
            console.log("patch=0");
          } else {
            console.log("patch="+JSON.stringify(delta).length); 
          }
          console.log("old data="+JSON.stringify($scope.users[1]).length);
          console.log("new data="+JSON.stringify($scope.users[1]).length);

          User.update(transmit, function(res) {
            console.log(res);
            $scope.mark = res[0]+res[1];
            //clear the data
            clear();
          });

      });
   };

});


