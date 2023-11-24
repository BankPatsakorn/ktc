angular.module('graph').controller('GraphUsageVehicleController', ['$rootScope', '$scope', '$iService', 'graphUsageVehicleFactory', 'graphEfficientFactory', 'trackingHistoryFactory', 'indexFactory',
  ($rootScope, $scope, $iService, graphUsageVehicleFactory, graphEfficientFactory, trackingHistoryFactory, indexFactory) => {

    $scope.$iService = $iService
    $scope.dataGraphUsageVehicle = []
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
          modem_id: $scope.selectVehicle,
          start: $scope.startDate,
          stop: $scope.stopDate
        }
        graphUsageVehicleFactory.getGraphUsageVehicle(_data, res => {
          if (res.status) {
            $scope.dataGraphEfficient = res.dataGraphEfficient
            $scope.dataGraphUsageVehicle = res.dataGraphUsageVehicle
          } else {
            $scope.dataGraphEfficient = []
            $scope.dataGraphUsageVehicle = []
            $iService.toggleModalMessage({
              title: $rootScope.text.page_graph_usage_vehicle.alert_title,
              detail: $rootScope.text.page_graph_usage_vehicle.alert_no_data
            })
          }
        })
        // trackingHistoryFactory.getTrackingHistory(_data, res => {
        //   if (res.length > 0) {
        //     const _time = [], _status = [], _tloc = [], _eloc = []
        //     let running_hour = 0
        //     let running_min = 0
        //     let running_sec = 0
        //     let idling_hour = 0
        //     let idling_min = 0
        //     let idling_sec = 0
        //     let parking_hour = 0
        //     let parking_min = 0
        //     let parking_sec = 0
        //     res.map((data, index) => {
        //       _time.push(data.gps_datetime)
        //       _status.push(parseInt(data.status))
        //       _tloc.push(`${data.tambol}:${data.amphur}:${data.province}`)
        //       _eloc.push(`${data.etambol}:${data.eamphur}:${data.eprovince}`)
        //       if (parseInt(data.status) == 1) {
        //         if (index+1 < res.length) {
        //           const _diff = $iService.diffDateTime(res[index+1].gps_datetime, data.gps_datetime)
        //           if (_diff.years > 0) {
        //             const _years = _diff.years * 365 * 24
        //             parking_hour += _years
        //           }
        //           if (_diff.months > 0) {
        //             const _months = _diff.months * 30 * 24
        //             parking_hour += _months
        //           }
        //           if (_diff.days > 0) {
        //             const _days = _diff.days * 24
        //             parking_hour += _days
        //           }
        //           if (_diff.hours > 0) {
        //             parking_hour += _diff.hours
        //           }
        //           if (_diff.minutes > 0) {
        //             parking_min += _diff.minutes
        //           }
        //           if (_diff.seconds > 0) {
        //             parking_sec += _diff.seconds
        //           }
        //         }
        //       } else if (parseInt(data.status) == 2) {
        //         if (index+1 < res.length) {
        //           const _diff = $iService.diffDateTime(res[index+1].gps_datetime, data.gps_datetime)
        //           if (_diff.years > 0) {
        //             const _years = _diff.years * 365 * 24
        //             idling_hour += _years
        //           }
        //           if (_diff.months > 0) {
        //             const _months = _diff.months * 30 * 24
        //             idling_hour += _months
        //           }
        //           if (_diff.days > 0) {
        //             const _days = _diff.days * 24
        //             idling_hour += _days
        //           }
        //           if (_diff.hours > 0) {
        //             idling_hour += _diff.hours
        //           }
        //           if (_diff.minutes > 0) {
        //             idling_min += _diff.minutes
        //           }
        //           if (_diff.seconds > 0) {
        //             idling_sec += _diff.seconds
        //           }
        //         }
        //       } else if (parseInt(data.status) == 3) {
        //         if (index+1 < res.length) {
        //           const _diff = $iService.diffDateTime(res[index+1].gps_datetime, data.gps_datetime)
        //           if (_diff.years > 0) {
        //             const _years = _diff.years * 365 * 24
        //             running_hour += _years
        //           }
        //           if (_diff.months > 0) {
        //             const _months = _diff.months * 30 * 24
        //             running_hour += _months
        //           }
        //           if (_diff.days > 0) {
        //             const _days = _diff.days * 24
        //             running_hour += _days
        //           }
        //           if (_diff.hours > 0) {
        //             running_hour += _diff.hours
        //           }
        //           if (_diff.minutes > 0) {
        //             running_min += _diff.minutes
        //           }
        //           if (_diff.seconds > 0) {
        //             running_sec += _diff.seconds
        //           }
        //         }
        //       }
        //     })
        //     if (running_sec >= 60) {
        //       const _min = running_sec / 60
        //       const _sec = running_sec % 60
        //       running_min += Math.floor(_min)
        //       running_sec = Math.floor(_sec)
        //     }
        //     if (running_min >= 60) {
        //       const _hour = running_min / 60
        //       const _min = running_min % 60
        //       running_hour += Math.floor(_hour)
        //       running_min = Math.floor(_min)
        //     }
        //     if (idling_sec >= 60) {
        //       const _min = idling_sec / 60
        //       const _sec = idling_sec % 60
        //       idling_min += Math.floor(_min)
        //       idling_sec = Math.floor(_sec)
        //     }
        //     if (idling_min >= 60) {
        //       const _hour = idling_min / 60
        //       const _min = idling_min % 60
        //       idling_hour += Math.floor(_hour)
        //       idling_min = Math.floor(_min)
        //     }
        //     if (parking_sec >= 60) {
        //       const _min = parking_sec / 60
        //       const _sec = parking_sec % 60
        //       parking_min += Math.floor(_min)
        //       parking_sec = Math.floor(_sec)
        //     }
        //     if (parking_min >= 60) {
        //       const _hour = parking_min / 60
        //       const _min = parking_min % 60
        //       parking_hour += Math.floor(_hour)
        //       parking_min = Math.floor(_min)
        //     }
        //     // let _sum_hour = running_hour + idling_hour + parking_hour
        //     // let _sum_min = running_min + idling_min + parking_min
        //     // let _sum_sec = running_sec + idling_sec + parking_sec
        //     $scope.dataGraphEfficient = [{
        //       ideling: parseFloat(`${idling_hour}.${idling_min < 10 ? "0" + idling_min : idling_min}`),
        //       parking: parseFloat(`${parking_hour}.${parking_min < 10 ? "0" + parking_min : parking_min}`),
        //       working: parseFloat(`${running_hour}.${running_min < 10 ? "0" + running_min : running_min}`)
        //     }]
        //     // const _diff_between = $iService.diffBetweenDatetime($scope.startDate, $scope.stopDate)
        //     // let _sum_diff_hours = 0
        //     // if (_diff_between.days > 0) {
        //     //   _sum_diff_hours = _diff_between.days * 24
        //     // }
        //     // let _sum_diff_mins = 0
        //     // if (_diff_between.hours > 0) {
        //     //   _sum_diff_mins = (_diff_between.hours * 60) + (_sum_diff_hours * 60) + _diff_between.minutes
        //     // }
        //     $scope.dataGraphUsageVehicle = [{
        //       name: "time",
        //       data: _time
        //     }, {
        //       status: "xstatus",
        //       data: _status
        //     }, {
        //       tloc: "xtloc",
        //       data: _tloc
        //     }, {
        //       eloc: "xtloc",
        //       data: _eloc
        //     }]
        //   }
        // })
      } else {
        $scope.dataGraphEfficient = []
        $scope.dataGraphUsageVehicle = []
        $iService.toggleModalMessage({
          title: $rootScope.text.page_graph_usage_vehicle.alert_title,
          detail: $rootScope.text.page_graph_usage_vehicle.alert_no_data
        })
      }
    }
  }
]).directive('graphUsageVehicle', ['$rootScope', '$window', '$timeout',
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
                const status = json[1].data[i]
                _data.push({
                  // x: Date.parse(json[0].data[i]),
                  x: Date.parse(moment(json[0].data[i])),
                  y: 100,
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
              text: $rootScope.text.page_graph_usage_vehicle.title
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
              title: { text: null },
              labels: {
                enabled: false
              }
            },
            tooltip: {
              formatter: function(args) {
                let this_point_index = this.series.data.indexOf(this.point), loc
                if ($rootScope.url_lang == 'th') {
                  let arr_loc = json[2].data[this_point_index].split(":")
                  loc = `
                    ${$rootScope.text.page_graph_usage_vehicle.sub_district}${arr_loc[0]} 
                    ${$rootScope.text.page_graph_usage_vehicle.district}${arr_loc[1]} 
                    ${$rootScope.text.page_graph_usage_vehicle.province}${arr_loc[2]}
                  `
                } else {
                  let arr_loc = json[3].data[this_point_index].split(":")
                  loc = `
                    ${$rootScope.text.page_graph_usage_vehicle.sub_district}${arr_loc[0]} 
                    ${$rootScope.text.page_graph_usage_vehicle.district}${arr_loc[1]} 
                    ${$rootScope.text.page_graph_usage_vehicle.province}${arr_loc[2]}
                  `
                }
                return `
                  <b>${moment(this.x).format("YYYY-MM-DD HH:mm:ss")}</b><br/>
                  ${$rootScope.text.page_graph_usage_vehicle.location}: ${loc}
                `
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
