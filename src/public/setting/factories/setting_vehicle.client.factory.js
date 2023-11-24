angular.module('setting').factory('settingVehicleFactory', ['$rootScope', '$iService',
  ($rootScope, $iService) => {
    return {
      getDataVehicle: (callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
						fleetname: $rootScope.authentication.fleetname
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.url()}get_vehicle_info_italthai`, strJson, header, (res) => {
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
      getDataMileage: (data, callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
						fleetname: $rootScope.authentication.fleetname,
            modem_id: data.modem_id
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.api()}gps/getMileageAlert`, strJson, header, (res) => {
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
      editDataMileage: (data, callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
            fleetname: $rootScope.authentication.fleetname,
            modem_id: data.modem_id,
            mileage_start: data.mileage_start,
            mileage_stop: data.mileage_stop,
            mileage_message_alert: data.mileage_message_alert
          }
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.api()}gps/editMileageAlert`, strJson, header, (res) => {
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
      editDataVehicle: (data, callback) => {
        if ($rootScope.authentication.token) {
          const strJson = {
            fleetid: $rootScope.authentication.fleetid,
            fleetname: $rootScope.authentication.fleetname,
            modem_id: data.modem_id,
            vehiclename: data.vehiclename,
            carlicence: data.carlicence,
            sim: data.sim,
            speedmax: data.speedmax,
            idlestop: data.idlestop,
            km_per_lite: data.km_per_lite,
            fueltank: data.fueltank,
            vbrand_id: data.vbrand_id,
            vehicle_model_id: data.vehicle_model_id,
            vtype_id: data.vtype_id,
            vehicle_color_id: data.vehicle_color_id,
            sim_brand: data.sim_brand,
            fuel_empty: data.fuel_empty,
            fuel_full: data.fuel_full,
            // set_point_1: data.set_point_1,
            // set_point_2: data.set_point_2,
            // set_point_3: data.set_point_3,
            calibrate_working_hour: data.calibrate_working_hour,
            due_date_service_hour: data.due_date_service_hour,
            waranty_expiration_hour: data.waranty_expiration_hour,
            vehicle_delivery_date: data.vehicle_delivery_date,
            waranty_expiration_date: data.waranty_expiration_date,
            customer_name: data.customer_name,
            company_name: data.company_name,
            customer_phone: data.customer_phone
          }
          console.log(strJson)
          const header = {
            token: $rootScope.authentication.token
          }
          $iService.postByHeader(`${$iService.url()}set_vehicle_info_italthai`, strJson, header, (res) => {
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
