angular.module("ContractsManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$rootScope", "$location", "$uibModal",
        function($scope, $http, $routeParams, $rootScope, $location, $modal) {
            $scope.idContract = $routeParams.idContract;
            console.log("EditCtrl initialized for contract " + $scope.idContract);
            $http
                .get("/api/v1/contracts/" + $scope.idContract)
                .then(function(response) {
                        $scope.updatedContract = response.data;
                        relatedcontracts(response.data.idContract.toLowerCase());

                        if ($scope.updatedContract.urlLeader != "") {
                            document.getElementById("inpLeader").disabled = true;
                            document.getElementById("btnValidateLeader").disabled = true;
                            document.getElementById("btnEditLeader").disabled = false;
                            document.getElementById("lblLeaderGroup").style.display = 'block';
                            document.getElementById("infLeaderGroup").style.display = 'block';
                            document.getElementById("leaderGroup").value = $scope.updatedContract.groupLeader;
                        }
                        else {
                            document.getElementById("inpLeader").disabled = false;
                            document.getElementById("btnValidateLeader").disabled = false;
                            document.getElementById("btnEditLeader").disabled = true;
                        }
                        for (var i = 0; i < $scope.updatedContract.researchers.length || i < 1; i++) {
                            document.getElementById("researcher" + (i + 1)).style.display = 'block';
                            var researcher = JSON.stringify($scope.updatedContract.researchers[i], 2, null);
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
                        }
                        document.getElementById("updatedContract.keywords").disabled = true;
                        document.getElementById("btnEditKeywords").disabled = false;
                        document.getElementById("btnSaveKeywords").disabled = true;
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
                $scope.updatedContract.groupLeader = "";
                $scope.updatedContract.urlGroupLeader = "";

            }
            $scope.editResearcher = function(id) {
                document.getElementById("inpResearcher" + id).disabled = false;
                document.getElementById("btnValidateResearcher" + id).disabled = false;
                document.getElementById("btnEditResearcher" + id).disabled = true;
                $scope.updatedContract.urlResearchers[id - 1] = "";

            }

            $scope.savekeywords = function() {
                $scope.updatedContract.keywords = document.getElementById("updatedContract.keywords").value;
                document.getElementById("updatedContract.keywords").disabled = true;
                document.getElementById("btnEditkeywords").disabled = false;
                document.getElementById("btnSavekeywords").disabled = true;

            }
            $scope.editkeywords = function() {
                document.getElementById("updatedContract.keywords").disabled = false;
                document.getElementById("btnEditkeywords").disabled = true;
                document.getElementById("btnSavekeywords").disabled = false;
            }


            function findGroupLeader(url) {
                $http
                    .get(url)
                    .then(function(response) {
                        if (response.data.length > 0) {
                            $scope.updatedContract.groupLeader = response.data[0].name;
                            $scope.updatedContract.urlGroupLeader = "https://si1718-rgg-groups.herokuapp.com/#!/group/" + response.data["0"].idGroup;
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
                                document.getElementById("lblLeaderGroup").style.display = 'block';
                                document.getElementById("infLeaderGroup").style.display = 'block';
                                $scope.updatedContract.urlResearchers = response.data["0"].idGroup;
                                // Get to find leader group
                                url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups?name=" + encodeURIComponent(response.data["0"].idGroup);
                                document.getElementById("leaderGroup").value = response.data["0"].idGroup;
                                findGroupLeader(url);
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

            function relatedcontracts(name) {
                $http
                    .get("/api/v1/rc/" + name)
                    .then(function(response) {
                        $scope.data = response.data;
                        for (var j = 0; j < $scope.data.recommendations.length; j++) {
                            var a = document.createElement('a');
                            a.href = '#!/contracts/'+ $scope.data.recommendations[j]; // Insted of calling setAttribute 
                            a.innerHTML = $scope.data.recommendations[j] + "   " // <a>INNER_TEXT</a>
                            document.getElementById("relatedContracts").appendChild(a); // Append the link to the div
                        }
                    });
            }
        }
    ]);
