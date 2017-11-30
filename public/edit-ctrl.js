angular.module("ContractsManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
            $scope.idContract = $routeParams.idContract;
            console.log("EditCtrl initialized for contract " + $scope.idContract);
            $http
                .get("/api/v1/contracts/" + $scope.idContract)
                .then(function(response) {
                        $scope.updatedContract = response.data;
                    },
                    function(error) {
                        mesageError(error.data);
                    });

            $scope.cancelUpdate = function() {
                $location.path("/");
            }
            
            $scope.updateContract = function() {

                delete $scope.updatedContract._id;

                $http
                    .put("/api/v1/contracts/" + $scope.idContract, $scope.updatedContract)
                    .then(function(response) {
                            console.log("updated");
                            $location.path("/");
                        },
                        function(error) {
                            mesageError(error.data);
                        });

            }

            function mesageError(e) {
                if (e == "Bad Request")
                    alert("Enter all the data required for the request. Bad Request, error 400.");
                if (e == "Unauthorized")
                    alert("Check the user permissions. Unauthorized, error 401.");
                if (e == "Not Found")
                    alert("No contracts o page with this information was found. Not Found,  error 404.");
                if (e == "Method Not Allowed")
                    alert("Action not allowed, check the request. Method Not Allowed,  error 405.");
                if (e == "Conflict")
                    alert("A contract with this reference already exists. Conflict, error 409.");
            }

        }
    ]);
