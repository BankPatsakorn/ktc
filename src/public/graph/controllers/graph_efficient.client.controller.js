angular.module('graph').controller('GraphEfficientController', ['$rootScope', '$scope', '$iService', 'graphEfficientFactory', 'indexFactory',
  ($rootScope, $scope, $iService, graphEfficientFactory, indexFactory) => {

  	$scope.$iService = $iService
    $scope.dataGraphEfficient = []
    
    indexFactory.getVehicleByFleet(res => {
      if (res.length > 0) {
        function compare(a, b) {
          if (a.vehicle_name < b.vehicle_name) {
            return -1
          }
          if (a.vehicle_name > b.vehicle_name) {
            return 1
          }
          return 0
        }
        res.sort(compare)
        $scope.dataSelectVehicle = res.map(data => {
          return {
            id: data.modem_id,
            text: data.vehicle_name
          }
        })
      } else {
        $scope.dataSelectVehicle = []
      }
    })

    $scope.setTextDate = (str) => {
      const res = str.split(" - ")
      $scope.startDate = res[0]
      $scope.stopDate = res[1]
    }

    $scope.setVehicleName = () => {
      $scope.vehicle_name = $scope.dataSelectVehicle.filter(data => (data.id == $scope.selectVehicle))
      $scope.vehicle_name = $scope.vehicle_name[0].text
    }

    $scope.searchDataGraph = () => {
      if ($scope.selectVehicle != "" && $scope.selectVehicle != null && $scope.selectVehicle !== '0' &&
        $scope.startDate != "" && $scope.startDate != null &&
        $scope.stopDate != "" && $scope.stopDate != null) {
        const _data = {
          modemid: $scope.selectVehicle,
          start: $scope.startDate,
          stop: $scope.stopDate
        }
        graphEfficientFactory.getDataGraphEfficient(_data, res => {
          $scope.setVehicleName()
          if (res.length > 0) {
            const _diff_between = $iService.diffBetweenDatetime($scope.startDate, $scope.stopDate)
            let _sum_diff_hours = 0
            if (_diff_between.days > 0) {
              _sum_diff_hours = _diff_between.days * 24
            }
            let _sum_diff_mins = 0
            if (_diff_between.hours > 0) {
              _sum_diff_mins = (_diff_between.hours * 60) + (_sum_diff_hours * 60) + _diff_between.minutes
            }
            const _sum_mins = res[0].total_ideling + res[0].total_parking + res[0].total_running
            let _ideling = res[0].total_ideling
            let _parking = res[0].total_parking
            let _working = res[0].total_running
            if (_sum_diff_mins > _sum_mins) {
              const _diff = _sum_diff_mins - _sum_mins
              _parking = _parking + _diff
            }
            if (_sum_diff_mins < _sum_mins) {
              const _diff = _sum_mins - _sum_diff_mins
              _parking = _parking - _diff
            }
            $scope.dataGraphEfficient = [{
              ideling: $iService.calTime(_ideling),
              parking: $iService.calTime(_parking),
              working: $iService.calTime(_working)
            }]
          } else {
            $scope.dataGraphEfficient = []
            $iService.toggleModalMessage({
              title: $rootScope.text.page_graph_efficient.alert_title,
              detail: $rootScope.text.page_graph_efficient.alert_no_data
            })
          }
        })
      } else {
        $iService.toggleModalMessage({
          title: $rootScope.text.page_graph_efficient.alert_title,
          detail: $rootScope.text.page_graph_efficient.alert_blank
        })
      }
    }
  }
]).directive('graphEfficient', ['$rootScope', '$window', '$timeout',
  ($rootScope, $window, $timeout) => {
    return {
      restrict: 'AC',
      scope: {
        data: '@',
        vehicleName: '@'
      },
      link: (scope, element, attrs) => {

        let chart = null

        angular.element($window).bind('resize', () => {
          scope.triggerSize()
          // manuall $digest required as resize event
          // is outside of angular
          scope.$digest()
        })

        scope.triggerSize = () => {
          if (chart != null) {
            const graph_width = chart.renderTo.clientWidth
            const graph_height = chart.renderTo.clientHeight
            chart.setSize(graph_width, graph_height)
          }
        }

        scope.$watch('data', (newValue) => {
          if (newValue && typeof newValue === 'string') {
            scope.setChart(JSON.parse(newValue))
          } else {
            scope.setChart([])
          }
        })

        scope.setChart = (json) => {
          const options = {
            chart: {
              type: 'pie',
              height: '350px',
              options3d: {
                enabled: true,
                alpha: 45
              },
              events: {
                beforePrint: function () {
                  this.oldhasUserSize = this.hasUserSize;
                  this.resetParams = [this.chartWidth, this.chartHeight, false];
                  this.setSize(this.chartWidth, this.chartHeight, false);
                },
                afterPrint: function () {
                  this.setSize.apply(this, this.resetParams);
                  this.hasUserSize = this.oldhasUserSize;
                }
              }
            },
            title: {
              text: $rootScope.text.page_graph_efficient.title
            },
            subtitle: {
              text: scope.vehicleName
            },
            plotOptions: {
              pie: {
                innerSize: 100,
                depth: 45,
                dataLabels: {
                  enabled: true,
                  formatter: function() {
                    return `<b>${this.point.name}</b>: ${this.percentage.toFixed(2)}%<br/>${this.point.y} ${$rootScope.text.page_graph_efficient.hours}`
                  }
                },
                showInLegend: true
              }
            },
            tooltip: {
              formatter: function() {
                return `<b>${this.point.name}</b>: ${this.percentage.toFixed(2)}%`
              }
            },
            series: [{
              data: [{
                name: $rootScope.text.page_graph_efficient.parking,
                y: json.length > 0 ? json[0].parking : null,
                color: '#FC5050'
              }, {
                name: $rootScope.text.page_graph_efficient.ideling,
                y: json.length > 0 ? json[0].ideling : null,
                color: '#F6EA27'
              }, {
                name: $rootScope.text.page_graph_efficient.working,
                y: json.length > 0 ? json[0].working : null,
                color: '#ADCE59'
              }]
            }]
          }
          chart = new Highcharts.Chart(attrs.id, options)
        }
      }
    }
  }
])
