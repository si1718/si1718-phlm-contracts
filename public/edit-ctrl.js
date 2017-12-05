angular.module("ContractsManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location",
        function($scope, $http, $routeParams, $location) {
            $scope.idContract = $routeParams.idContract;
            console.log("EditCtrl initialized for contract " + $scope.idContract);
            $http
                .get("/api/v1/contracts/" + $scope.idContract)
                .then(function(response) {
                        $scope.updatedContract = response.data;

                        if ($scope.updatedContract.urlLeader != "") {
                            document.getElementById("inpLeader").disabled = true;
                            document.getElementById("btnValidateLeader").disabled = true;
                            document.getElementById("btnEditLeader").disabled = false;
                        }
                        else {
                            document.getElementById("inpLeader").disabled = false;
                            document.getElementById("btnValidateLeader").disabled = false;
                            document.getElementById("btnEditLeader").disabled = true;
                        }
                        for (var i = 0; i < $scope.updatedContract.researchers.length; i++) {
                            document.getElementById("researcher" + (i + 1)).style.display = 'block';
                            var researcher = JSON.stringify($scope.updatedContract.researchers[i], 2, null).replace(/"/g, "");
                            document.getElementById("inpResearcher" + (i + 1)).value = researcher;
                            if ($scope.updatedContract.urlResearchers[i] == "") {
                                document.getElementById("btnEditResearcher" + (i + 1)).disabled = true;
                                document.getElementById("btnValidateResearcher" + (i + 1)).disabled = false;
                            }
                            else {
                                document.getElementById("btnEditResearcher" + (i + 1)).disabled = false;
                                document.getElementById("btnValidateResearcher" + (i + 1)).disabled = true;
                                document.getElementById("inpResearcher" + (i + 1)).disabled = true;
                            }
                            document.getElementById("updatedContract.keyWords").disabled = true;
                            document.getElementById("btnEditKeyWords").disabled = false;
                            document.getElementById("btnSaveKeyWords").disabled = true;
                        }
                        document.getElementById("leaderGroup").disabled = true;
                    },
                    function(error) {
                        mesageError(error.data);
                    });
            $scope.cancelUpdate = function() {
                $location.path("/");
            }

            $scope.updateContract = function() {


                for (var i = 0; i < $scope.updatedContract.researchers.length; i++) {
                    $scope.updatedContract.researchers[i] = document.getElementById("inpResearcher" + (i + 1)).value;
                    if (document.getElementById("btnValidateResearcher" + (i + 1)).disabled == false)
                        $scope.updatedContract.urlResearchers[i] = "";

                }

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
            $scope.editLeader = function() {
                document.getElementById("inpLeader").disabled = false;
                document.getElementById("btnValidateLeader").disabled = false;
                document.getElementById("btnEditLeader").disabled = true;
                $scope.updatedContract.urlLeader = "";
                document.getElementById("lblLeaderGroup").style.display = 'none';
                document.getElementById("infLeaderGroup").style.display = 'none';

            }
            $scope.editResearcher = function(id) {
                document.getElementById("inpResearcher" + id).disabled = false;
                document.getElementById("btnValidateResearcher" + id).disabled = false;
                document.getElementById("btnEditResearcher" + id).disabled = true;
                $scope.updatedContract.urlResearchers[id - 1] = "";

            }

            $scope.saveKeyWords = function() {
                $scope.updatedContract.keyWords = document.getElementById("updatedContract.keyWords").value;
                document.getElementById("updatedContract.keyWords").disabled = true;
                document.getElementById("btnEditKeyWords").disabled = false;
                document.getElementById("btnSaveKeyWords").disabled = true;

            }
            $scope.editKeyWords = function() {
                document.getElementById("updatedContract.keyWords").disabled = false;
                document.getElementById("btnEditKeyWords").disabled = true;
                document.getElementById("btnSaveKeyWords").disabled = false;
            }


            function findGroupLeader(url) {
                $http
                    .get(url)
                    .then(function(response) {
                        if (response.data.length > 0) {
                            $scope.updatedContract.groupLeader = response.data[0].idGroup;
                            $scope.updatedContract.dptLeader = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/" + response.data["0"].idResearcher;
                        }
                        else
                            alert("There is no group linked to the researcher");
                    });
            }


            $scope.validateLeader = function() {
                var url = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/?search=" + encodeURIComponent($scope.updatedContract.leader);
                $http
                    .get(url)
                    .then(function(response) {
                            if (response.data.length > 0) {
                                $scope.updatedContract.urlLeader = "http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data["0"].idResearcher;
                                document.getElementById("inpLeader").disabled = true;
                                document.getElementById("btnValidateLeader").disabled = true;
                                document.getElementById("btnEditLeader").disabled = false;
                                console.log("Leader validated");
                                //document.getElementById("lblLeaderGroup").style.display = 'block';
                                //document.getElementById("infLeaderGroup").style.display = 'block';
                                $scope.updatedContract.urlResearchers = response.data["0"].idGroup;
                                // Get to find leader group
                                url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups?search=" + encodeURIComponent(response.data["0"].idGroup);
                                document.getElementById("infLeaderGroup").value = response.data["0"].idGroup;
                                // findGroupLeader(url);
                            }
                            else
                                alert("Leader not found");
                        },
                        function(error) {
                            mesageError(error.data);
                        });
            }

            $scope.validateResearcher = function(id) {
                var url = "https://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/?search=" + encodeURIComponent(document.getElementById("inpResearcher" + id).value);
                $http
                    .get(url)
                    .then(function(response) {
                            if (response.data.length > 0) {
                                $scope.updatedContract.urlResearchers[id - 1] = "http://si1718-dfr-researchers.herokuapp.com/api/v1/researchers/" + response.data["0"].idResearcher;
                                document.getElementById("inpResearcher" + id).disabled = true;
                                document.getElementById("btnValidateResearcher" + id).disabled = true;
                                document.getElementById("btnEditResearcher" + id).disabled = false;
                                console.log("Researcher validated");
                            }
                            else
                                alert("Researcher not found");
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
