angular.module("ContractsManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        function refresh() {
            $http
                .get("/api/v1/contracts/")
                .then(function(response) {
                    $scope.data = response.data;
                    var startsDate = new Array();

                    for (var i = 0; i < $scope.data.length; i++) {
                        var year = $scope.data[i].startDate.substring($scope.data[i].startDate.length - 4,$scope.data[i].startDate.length);
                        if (year.length == 4)
                            startsDate.push(parseInt(year));
                    }

                    var countYear = {}
                    for (i = 1996; i<=2018; i++)
                        countYear[i] = 0;
                    
                    for (var i = 0; i < startsDate.length; i++) {
                        countYear[startsDate[i]] = countYear[startsDate[i]] + 1;
                    }    
                    
                    Highcharts.chart('container', {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Contracts per year'
                        },
                        yAxis: {
                            title: {
                                text: 'Total contracts'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        series: [{
                            name: 'Contracts University of Seville',
                            data: [
                                ['1996', countYear[1996]],
                                ['1997', countYear[1997]],
                                ['1998', countYear[1998]],
                                ['1999', countYear[1999]],
                                ['2000', countYear[2000]],
                                ['2001', countYear[2001]],
                                ['2002', countYear[2002]],
                                ['2003', countYear[2003]],
                                ['2004', countYear[2004]],
                                ['2005', countYear[2005]],
                                ['2006', countYear[2006]],
                                ['2007', countYear[2007]],
                                ['2008', countYear[2008]],
                                ['2009', countYear[2009]],
                                ['2010', countYear[2010]],
                                ['2011', countYear[2011]],
                                ['2012', countYear[2012]],
                                ['2013', countYear[2013]],
                                ['2014', countYear[2014]],
                                ['2015', countYear[2015]],
                                ['2016', countYear[2016]],
                                ['2017', countYear[2017]],
                                ['2018', countYear[2018]]

                            ],
                            dataLabels: {
                                enabled: true,
                                rotation: -90,
                                color: '#FFFFFF',
                                align: 'right',
                                format: '{point.y:.1f}', // one decimal
                                y: 10, // 10 pixels down from the top
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        }]
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
            //var url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/" + document.getElementById('cmbGroups').value;
            var url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/";
            $http
                .get(url)
                .then(function(response) {
                    if (response.data.length > 0) {
                        var researchersGroup = [];
                        researchersGroup.push(JSON.stringify(response.data[0].leader, 2, null));
                        for (var i = 0; i < response.data[0].components.length; i++)
                            researchersGroup.push(JSON.stringify(response.data.length));
                        
                        var contractLeaderGroup = [];
                        for (var i=0; i<researchersGroup.length; i++) {
                                    var searchURL = "?";
                                    if (researchersGroup[i]) {
                                        searchURL = searchURL + "leader=" + researchersGroup[i];
                                    }
                                    $http
                                        .get("/api/v1/contracts" + searchURL)
                                        .then(function(response) {
                                            contractLeaderGroup.push(response.data.length);
                                        });                                
                        }
                        alert(contractLeaderGroup.toString());
                    }
            });
    }
        refresh();

    }]);
