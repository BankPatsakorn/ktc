angular.module('maintenance').factory('maintenanceWorkingHoursFactory', ['$rootScope', '$iService',
  ($rootScope, $iService) => {
    return {
      getMaintenanceWorkingHours: callback => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
            fleetname: $rootScope.authentication.fleetname
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.url()}maintanace_italthai`, strJson, header, (res) => {
          // $iService.postByHeader(`${$iService.api()}gps/getMaintenanceWorkingHours`, strJson, header, (res) => {
            if ($.trim(res)) {
              callback(res)
            } else {
              callback([])
            }
          })
        } else {
          $iService.clearToken()
        }
      },
      editMaintenanceWorkingHours: (data, callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
            fleetname: $rootScope.authentication.fleetname,
            modemid: data.modem_id,
            hour_start_service: data.hour_start_service,
            waranty_expiration_date: data.waranty_expiration_date
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.url()}set_hour_start_service`, strJson, header, (res) => {
          // $iService.postByHeader(`${$iService.api()}gps/editMaintenanceLubricant`, strJson, header, (res) => {
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
