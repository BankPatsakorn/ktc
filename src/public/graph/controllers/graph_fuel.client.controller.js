angular.module('graph').controller('GraphFuelController', ['$rootScope', '$scope', '$iService', 'graphFuelFactory', 'indexFactory',
  ($rootScope, $scope, $iService, graphFuelFactory, indexFactory) => {

    $scope.$iService = $iService
    $scope.dataGraphFuel = []
    
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
        graphFuelFactory.getDataGraphFuel(_data, res => {
          $scope.setVehicleName()
          if (res.length > 0) {
            $scope.dataGraphFuel = res
          } else {
            $scope.dataGraphFuel = []
            $iService.toggleModalMessage({
              title: $rootScope.text.page_graph_fuel.alert_title,
              detail: $rootScope.text.page_graph_fuel.alert_no_data
            })
          }
        })
      } else {
        $iService.toggleModalMessage({
          title: $rootScope.text.page_graph_fuel.alert_title,
          detail: $rootScope.text.page_graph_fuel.alert_blank
        })
      }
    }
  }
]).directive('graphFuel', ['$rootScope', '$window', '$timeout',
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
          function color(value) {
            let color = ''
            switch (value) {
              case 1:
                color = '#FC5050'
                break
              case 2:
                color = '#F6EA27'
                break
              case 3:
                color = '#ADCE59'
                break
            }
            return color
          }
          function genData(json) {
            let _data = [], i = 0
            if (json.length > 0) {
              while (i < json[0].data.length) {
                const fuel = json[1].data[i]
                const status = json[4].data[i]
                _data.push({
                  x: Date.parse(json[0].data[i]),
                  y: fuel,
                  segmentColor: color(status)
                })
                i++
              }
            }
            return _data
          }
          const options = {
            chart: {
              type: 'coloredarea',
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
              text: $rootScope.text.page_graph_fuel.title
            },
            subtitle: {
              text: scope.vehicleName
            },
            xAxis: {
              type: 'datetime',
              labels: {
                formatter: function() {
                  return moment(this.value).format("YYYY-MM-DD HH:mm")
                },
                style: {
                  color: "#666666",
                  fontFamily: "Kanit",
                  fontSize: "12px",
                  fontWeight: 400
                },
                y: 30,
                rotation: -30
              }
            },
            yAxis: {
              title: { text: null }
            },
            tooltip: {
              formatter: function(args) {
                const this_point_index = this.series.data.indexOf(this.point)
                let loc
                if ($rootScope.url_lang == 'th') {
                  const arr_loc = json[2].data[this_point_index].split(":")
                  loc = `
                    ${$rootScope.text.page_graph_fuel.sub_district}${arr_loc[0]} 
                    ${$rootScope.text.page_graph_fuel.district}${arr_loc[1]} 
                    ${$rootScope.text.page_graph_fuel.province}${arr_loc[2]}
                  `
                } else {
                  const arr_loc = json[3].data[this_point_index].split(":")
                  loc = `
                    ${$rootScope.text.page_graph_fuel.sub_district}${arr_loc[0]} 
                    ${$rootScope.text.page_graph_fuel.district}${arr_loc[1]} 
                    ${$rootScope.text.page_graph_fuel.province}${arr_loc[2]}
                  `
                }
                return `<b>${moment(this.x).format("YYYY-MM-DD HH:mm:ss")}</b><br/>${$rootScope.text.page_graph_fuel.location}: ${loc}`
              }
            },
            series: [{
              turboThreshold: 50000,
              showInLegend: false,
              type: 'coloredarea',
              data: genData(json)
            }]
          }
          chart = new Highcharts.Chart(attrs.id, options)
        }
      }
    }
  }
])
