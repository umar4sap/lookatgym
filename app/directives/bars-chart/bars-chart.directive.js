angular.module('zoneapp')
    .directive('barsChart', ['$window', function($window) {
        
        var directiveDefinitionObject = {
            restrict: 'A',
            scope: { data: '=chartData' },
            link: function(scope, element, attrs) {
                var chart = $window.d3.select(element[0]);
                chart.attr("class", "chart")
                    .selectAll('div')
                    .data(scope.data)
                    .enter().append("div")
                    .text(function(d) { return d + "%"; })
                    .transition()
                    .ease('elastic')
                    .duration(1000)
                    .style("width", function(d) { return d + "%"; });
            }
        };
        return directiveDefinitionObject;
    }])
    .controller("barsChartController", ['$scope', function($scope) {
        
        $scope.myData = [10, 20, 30, 40, 60];
    }])

   
    .controller('chartController', function($scope) {
      var chart1 = {};
      chart1.type = "google.charts.Bar";
      chart1.displayed = false;
      chart1.data = {
        "cols": [{
          id: "Pipeline Builds",
          label: "Builds",
          type: "string"
        }, {
          id: "Running-id",
          label: "Success",
          type: "number"
        }, {
          id: "Failed-id",
          label: "Failed",
          type: "number"
        }],
        "rows": [{
          c: [{
              v: "Executed Builds"
            }, {
              v: 24
            }, {
              v: 5
            }
          ]
        }]
      };
  
      chart1.options = {
        "title": "Sales per month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Sales unit",
          "gridlines": {
            "count": 10
          }
        },
        "hAxis": {
          "title": "Date"
        }
      };
      $scope.myChart = chart1;
    }).value('googleChartApiConfig', {
      version: '1.1',
      optionalSettings: {
        packages: ['bar'],
        language: 'en'
      }
    });