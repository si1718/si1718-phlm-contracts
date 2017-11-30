angular.module("ContractsManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh() {
            $http
                .get("/api/v1/contracts/data")
                .then(function(response) {
                        $scope.data = response.data;

                        Highcharts.chart('container', {

                            title: {
                                text: 'My data'
                            },

                            yAxis: {
                                title: {
                                    text: 'Data'
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
                                    pointStart: 1
                                }
                            },

                            series: [{
                                name: 'Data',
                                data: $scope.data
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
        }
        
        refresh();

    }]);
