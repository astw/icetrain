'use strict';

angular.module('psJwtApp')
    .controller('RegisterCtrl', function ($scope,alert, $auth) {
        $scope.submit = function(){
            $auth.signup(
                {
                    email:$scope.email,
                    password:$scope.password
                })
                .then(function(res){
                    alert("success", "Account Created!", "Welcome, " + res.data.user.email
                        + " ! Please email active your account in the next several days. ");
                })
                .catch(function(err){
                    console.log("bad");
                    alert("warning", "Oops", "Could not register" + err);
                });
        };
    });


//angular.module('psJwtApp')
//  .controller('RegisterCtrl', function ($scope,alert, auth) {
//    $scope.submit = function(){
//        auth.register($scope.email,$scope.password)
//            .success(function(res){
//                alert("success", "Account Created!", "Welcome, " + res.user.email);
//            })
//            .error(function(err){
//                console.log("bad");
//                alert("warning", "Oops", "Could not register" + err);
//            });
//    };
//  });
