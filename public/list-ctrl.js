  angular.module("ContractsManagerApp")
      .controller("ListCtrl", ["$scope", "$http", "$uibModal", "$timeout", "$rootScope", function($scope, $http, $uibModal, $timeout, $rootScope) {
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

        function refresh() {
            $http
                .get("/api/v1/contracts")
                .then(function(response) {
                        $scope.contracts = response.data;
                    },
                    function(error) {
                        mesageError(error.data);
                    });


            $scope.contract = {
                idContract: "",
                nmContract: "",
                leader: "",
                reference: "",
                startDate: "",
                finishDate: "",
                funders: "",
                researchers: "",
                keyWords: ""
            }

        }

        $scope.addContract = function() {

            if (document.getElementById("contract.reference").value == "" ||
                document.getElementById("contract.nmContract").value == "" ||
                document.getElementById("contract.leader").value == "" ||
                document.getElementById("contract.startDate").value == "" ||
                document.getElementById("contract.finishDate").value == "" ||
                document.getElementById("contract.funders").value == "" ||
                document.getElementById("contract.researchers").value == "" ||
                document.getElementById("contract.keyWords").value == "") {
                alert("All data is required");
            }


            $http
                .post("/api/v1/contracts/", $scope.contract)
                .then(function(response) {
                    refresh();
                }, function(error) {
                    mesageError(error.data);
                });

        }

        $scope.deleteContract = function(name) {

            $http
                .delete("/api/v1/contracts/" + name)
                .then(function(response) {
                        refresh();
                    },
                    function(error) {
                        mesageError(error.data);
                    });

        }

        $scope.search = function() {

            var searchURL = "";
            if ($scope.contract.reference) {
                searchURL = searchURL + "reference=" + $scope.contract.reference + "&";
            }
            if ($scope.contract.nmContract) {
                searchURL = searchURL + "nmContract=" + $scope.contract.nmContract + "&";
            }
            if ($scope.contract.leader) {
                searchURL = searchURL + "leader=" + $scope.contract.leader + "&";
            }
            if ($scope.contract.startDate) {
                searchURL = searchURL + "startDate=" + $scope.contract.startDate + "&";
            }
            if ($scope.contract.finishDate) {
                searchURL = searchURL + "finishDate=" + $scope.contract.finishDate + "&";
            }
            if ($scope.contract.funders) {
                searchURL = searchURL + "funders=" + $scope.contract.funders + "&";
            }
            if ($scope.contract.researchers) {
                searchURL = searchURL + "researchers=" + $scope.contract.researchers + "&";
            }
            if ($scope.contract.keyWords) {
                searchURL = searchURL + "keyWords=" + $scope.contract.keyWords + "&";
            }
            if (searchURL.length > 0) {
                searchURL = "?" + searchURL;
                searchURL = searchURL.substring(0, searchURL.length - 1);
            }
            console.log(searchURL);
            $http
                .get("/api/v1/contracts" + searchURL)
                .then(function(response) {
                        $scope.contracts = response.data;
                    },
                    function(error) {
                        mesageError(error.data);
                    });
        }

        refresh();

    }]);
