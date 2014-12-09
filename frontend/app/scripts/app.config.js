angular
    .module('psJwtApp').config(function (
        $stateProvider,
        $urlRouterProvider,
        $httpProvider,
        $authProvider,
        API_URL
    ) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("register", {
                url: "/register",
                templateUrl: "/views/register.html",
                controller: "RegisterCtrl"
            })
            .state("login", {
                url: "/login",
                templateUrl: "/views/login.html",
                controller: "LoginCtrl"
            })
            .state("logout", {
                url: "/logout",
                templateUrl: "/",
                controller: "LogoutCtrl"
            })
            .state("jobs", {
                url: "/jobs",
                controller: "JobsCtrl",
                templateUrl: "/views/jobs.html"
            })
            .state("main", {
                url: "/",
                templateUrl: "/views/main.html"
            });

        $authProvider.google({
            clientId: "330963785259-4e2l7l5kp630riijjlk33itveiabs8o6.apps.googleusercontent.com",
            url: API_URL + "auth/google"
        });

        $authProvider.facebook({
            clientId: "1568256110072907",
            url: API_URL + "auth/facebook"
        });

     //   $authProvider.loginUrl = API_URL + "login";
     //   $authProvider.signupUrl = API_URL + "register";
        $authProvider.loginUrl = API_URL + "auth/login";
        $authProvider.signupUrl = API_URL + "auth/register";


        $httpProvider.interceptors.push("authInterceptor");

    })
    //.constant('API_URL', "http://localhost:3000/")
    .constant('API_URL', "http://localhost:1337/")   // connect to  sails api
    .run(function ($window) {
        var param = $window.location.search.substring(1);
        console.log(param);
        if (param && $window.opener && $window.opener.location.origin === $window.location.origin) {
            var pair = param.split("=");
            var code = decodeURIComponent(pair[1]);

            //pass value from pop up window to main window
            $window.opener.postMessage(code, $window.location.origin);
        }
    });