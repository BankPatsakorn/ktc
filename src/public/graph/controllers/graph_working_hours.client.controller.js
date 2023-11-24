angular.module('graph').controller('GraphWorkingHoursController', ['$rootScope', '$scope', '$iService', 'graphWorkingHoursFactory', 'settingVehicleFactory', 'indexFactory',
  ($rootScope, $scope, $iService, graphWorkingHoursFactory, settingVehicleFactory, indexFactory) => {

  	$scope.$iService = $iService
    $scope.dataGraphWorkingHours = []
    $scope.dataSettingVehicle = []

    settingVehicleFactory.getDataVehicle(res => {
      if (res.length > 0) {
        $scope.dataSettingVehicle = res
      }
    })
    
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

    $scope.setSpeedMax = () => {
      $scope.vehicle_setting = $scope.dataSettingVehicle.filter(data => (data.modem_id == $scope.selectVehicle))
      $scope.speed_max = $scope.vehicle_setting[0].speedmax
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
        graphWorkingHoursFactory.getDataGraphWorkingHours(_data, res => {
          $scope.setVehicleName()
          $scope.setSpeedMax()
          if (res.length > 0) {
            const working_hours = res.map(data => {
              return {
                name: data.date_process,
                data: [
                  parseInt(data.working_00),
                  parseInt(data.working_01),
                  parseInt(data.working_02),
                  parseInt(data.working_03),
                  parseInt(data.working_04),
                  parseInt(data.working_05),
                  parseInt(data.working_06),
                  parseInt(data.working_07),
                  parseInt(data.working_08),
                  parseInt(data.working_00),
                  parseInt(data.working_10),
                  parseInt(data.working_11),
                  parseInt(data.working_12),
                  parseInt(data.working_13),
                  parseInt(data.working_14),
                  parseInt(data.working_15),
                  parseInt(data.working_16),
                  parseInt(data.working_17),
                  parseInt(data.working_18),
                  parseInt(data.working_19),
                  parseInt(data.working_20),
                  parseInt(data.working_21),
                  parseInt(data.working_22),
                  parseInt(data.working_23)
                ]
              }
            })
            $scope.dataGraphWorkingHours = working_hours
          } else {
            $scope.dataGraphWorkingHours = []
            $iService.toggleModalMessage({
              title: $rootScope.text.page_graph_working_hours.alert_title,
              detail: $rootScope.text.page_graph_working_hours.alert_no_data
            })
          }
        })
      } else {
        $iService.toggleModalMessage({
          title: $rootScope.text.page_graph_working_hours.alert_title,
          detail: $rootScope.text.page_graph_working_hours.alert_blank
        })
      }
    }
  }
]).directive('graphWorkingHours', ['$rootScope', '$window', '$timeout',
  ($rootScope, $window, $timeout) => {
    return {
      restrict: 'AC',
      scope: {
        data: '@',
        vehicleName: '@',
        speedMax: '@'
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
              zoomType: 'xy',
              height: '350px',
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
              text: $rootScope.text.page_graph_working_hours.title
            },
            subtitle: {
              text: scope.vehicleName
            },
            plotOptions: {
              series: {
                label: {
                  connectorAllowed: false
                },
                pointStart: 0
              },
            },
            series: json
          }
          chart = new Highcharts.Chart(attrs.id, options)
        }
      }
    }
  }
])
