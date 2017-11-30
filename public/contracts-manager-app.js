angular.module("ContractsManagerApp", ["ngRoute"])
    .config(function($routeProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListCtrl"
            }).when("/contracts/:idContract", {
                templateUrl: "edit.html",
                controller: "EditCtrl"
            }).when("/graph", {
                templateUrl: "graph.html",
                controller: "GraphCtrl"
            });
        console.log("App Initialized");

    });