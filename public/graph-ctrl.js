angular.module("ContractsManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh() {
            $http
                .get("/api/v1/contracts/")
                .then(function(response) {
                    $scope.data = response.data;
                    var startsDate = new Array();

                    for (var i = 0; i < $scope.data.length; i++) {
                        var year = $scope.data[i].startDate.substring($scope.data[i].startDate.length - 4);
                        if (!isNaN(year))
                            startsDate.push(parseInt($scope.data[i].startDate.substr($scope.data[i].startDate.length - 4)));
                    }

                    var maxStartDay = Math.max.apply(Math, startsDate);
                    var minStartDay = Math.min.apply(Math, startsDate);
                    var countYear = Array.apply(null, Array(maxStartDay - minStartDay + 1)).map(Number.prototype.valueOf, 0);

                    for (var i = 0; i < startsDate.length; i++)
                        countYear[startsDate[i] - minStartDay] = countYear[startsDate[i] - minStartDay] + 1;
                        
                    Highcharts.chart('container', {

                        title: {
                            text: 'Contract per year'
                        },

                        yAxis: {
                            title: {
                                text: 'Number of Contracts'
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },

                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                                pointStart: minStartDay
                            }
                        },

                        series: [{
                            name: 'Contract',
                            data: countYear
                        }],

                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 500
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }

                    });
                });

            var url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/";
            $http
                .get(url)
                .then(function(response) {
                    $scope.data = response.data;
                    daySelect = document.getElementById('cmbGroups');
                    for (var i = 0; i < $scope.data.length; i++)
                        daySelect.options[daySelect.options.length] = new Option($scope.data[i].name, $scope.data[i].idGroup);
                });
        }
        $scope.showContractGroups = function() {
            var url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/" + document.getElementById('cmbGroups').value;
            $http
                .get(url)
                .then(function(response) {
                    if (response.data.length > 0) {
                        var researchersGroup = [];
                        researchersGroup.push(JSON.stringify(response.data[0].leader, 2, null));
                        for (var i = 0; i < response.data[0].components.length; i++)
                            researchersGroup.push(JSON.stringify(response.data[0].components[i], 2, null));
                        alert(researchersGroup.toString());
                    }
                });
        }
        refresh();

    }]);
