angular.module('graph').factory('graphUsageVehicleFactory', ['$rootScope', '$iService',
  ($rootScope, $iService) => {
    return {
      getGraphUsageVehicle: (data, callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
            fleetname: $rootScope.authentication.fleetname,
            modem_id: data.modem_id,
            start: data.start,
            stop: data.stop
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.api()}gps/getGraphUsageVehicle`, strJson, header, (res) => {
          // $iService.postByHeader(`${$iService.url()}rp_graph_vehicle_status_italthai`, strJson, header, (res) => {
          // $iService.postByHeader(`${$iService.url()}chart_status_vehicle`, strJson, header, (res) => {
            if ($.trim(res)) {
              callback(res)
            } else {
              callback([])
            }
          })
        } else {
          $iService.clearToken()
        }
      }
    }
  }
])
