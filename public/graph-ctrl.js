angular.module("ContractsManagerApp")
    .controller("GraphCtrl", ["$scope", "$http", function($scope, $http) {
        var kwStatistics = [];
        var keywords = [];

        function refresh() {
            var url = "https://si1718-rgg-groups.herokuapp.com/api/v1/groups/";
            /* $http
                 .get(url)
                 .then(function(response) {
                     //$scope.data = JSON.stringify(response.data, 2, null);
                     $scope.data = response.data;
                     groupSelect = document.getElementById('cmbGroups');
                     for (var i = 0; i < $scope.data.length; i++)
                         groupSelect.options[groupSelect.options.length] = new Option($scope.data[i].name, $scope.data[i].idGroup);
                 });
             */
            $http
                .get("/api/v1/keywords")
                .then(function(response) {
                    $scope.data = response.data;
                    kwSelect = document.getElementById('cmbGroupsKw');
                    for (var i = 0; i < $scope.data.length; i++) {
                        https: var lstKeywords = $scope.data[i].keywords;
                        for (var j = 0; j < lstKeywords.length; j++) {
                            kwSelect.options[kwSelect.options.length] = new Option(lstKeywords[j].toLowerCase(), lstKeywords[j]);
                            keywords.push(lstKeywords[j]);
                        }
                    }
                });
            showAllContractKw();
        }

        $scope.showAllContract = function() {
            $http
                .get("/api/v1/contracts/")
                .then(function(response) {
                    $scope.data = response.data;
                    var startsDate = new Array();

                    for (var i = 0; i < $scope.data.length; i++) {
                        var year = $scope.data[i].startDate.substring($scope.data[i].startDate.length - 4, $scope.data[i].startDate.length);
                        if (year.length == 4)
                            startsDate.push(parseInt(year));
                    }

                    var countYear = {}
                    for (i = 1996; i <= 2018; i++)
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
                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: true
                                },
                                pointStart: 1996
                            }
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

        }

        $scope.showStatistictsKw = function() {
            var keyword = document.getElementById("cmbGroupsKw").value;
            var lsFreqDay = [];
            for (var i = 0; i < kwStatistics.length; i++) {
                if (kwStatistics[i].key.indexOf(keyword) > 10) {
                    lsFreqDay.push(kwStatistics[i]);
                }
            }
            lsFreqDay.sort(function(a, b) { return a.frequency - b.frequency });

            Highcharts.chart('container3', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Twitter Keyword Occurrence Streaming - ' + keyword
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: true
                        },
                        pointStart: 1
                    }
                },
                yAxis: {
                    title: {
                        text: 'Frequency'
                    }
                },
                legend: {
                    enabled: false
                },
                series: [{
                    name: 'Contracts University of Seville',
                    data: [
                        [lsFreqDay[0].key,  parseInt(lsFreqDay[0].frequency)],
                        [lsFreqDay[1].key,  parseInt(lsFreqDay[1].frequency)],
                        [lsFreqDay[2].key,  parseInt(lsFreqDay[2].frequency)],
                        [lsFreqDay[3].key,  parseInt(lsFreqDay[3].frequency)],
                        [lsFreqDay[4].key,  parseInt(lsFreqDay[4].frequency)],
                        [lsFreqDay[5].key,  parseInt(lsFreqDay[5].frequency)],
                        [lsFreqDay[6].key,  parseInt(lsFreqDay[6].frequency)],
                        [lsFreqDay[7].key,  parseInt(lsFreqDay[7].frequency)],
                        [lsFreqDay[8].key,  parseInt(lsFreqDay[8].frequency)],
                        [lsFreqDay[9].key,  parseInt(lsFreqDay[9].frequency)],
                        [lsFreqDay[10].key, parseInt(lsFreqDay[10].frequency)],
                        [lsFreqDay[11].key, parseInt(lsFreqDay[11].frequency)]
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
                        for (var i = 0; i < researchersGroup.length; i++) {
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
                    }
                });
        }

        function showAllContractKw() {
            $http
                .get("/api/v1/statistics")
                .then(function(response) {
                    kwStatistics = response.data;
                    var mapStatisticsYear = new Map();
                    for (var i = 0; i < kwStatistics.length; i++) {
                        if (kwStatistics[i].key.indexOf("Dec.") == 0 || kwStatistics[i].key.indexOf("Jan.") == 0) {
                            mapStatisticsYear.set(kwStatistics[i].key, kwStatistics[i].frequency);
                        }
                    }
                    showTableStatistics(mapStatisticsYear);
                });
        }

        function showTableStatistics(datos) {
            var html =
                '<table class="table"> ' +
                '<tr> <td> Keyword </td>  <td> December </td>  <td> January </td> </tr>';
            for (var i = 0; i < keywords.length; i++)
                html = html + '<tr>   <td>' + keywords[i].toLowerCase() + '</td><td>' + datos.get('Dec.' + keywords[i]) + '</td> <td> ' + datos.get('Jan.' + keywords[i]) + ' </td> </tr>';

            html = html + '</table>';
            document.getElementById("tableStatistics").insertAdjacentHTML("beforeend", html);
        }
        refresh();

    }]);
