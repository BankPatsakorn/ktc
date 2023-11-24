angular.module('index').service('$iService', ['$rootScope', '$location', '$window', '$http', '$timeout',
  function($rootScope, $location, $window, $http, $timeout) {

  	this.url = function() {
      return 'http://61.91.14.253:9003/api/'
    }

  	this.api = function() {
      // return 'http://61.91.14.253:14290/'
      return 'http://localhost:14290/'
    }

    this.host = function() {
      // return 'http://www.italthaigps.com/'
      return 'http://localhost:8007/'
    }

    this.sock = function() {
      return new SockJS('http://61.91.14.253:9004/chat')
    }

    this.host_picture = function() {
      return 'http://61.91.14.253:8003/api/'
    }

    this.getParameter = function(url, callback) {
      $http({
        method: 'GET',
        url: url
      }).then((res) => {
        // success
        callback(res.data)
      }, (err) => {
        // error
        callback(null)
      })
    }

    this.postParameter = function(url, strJson, callback) {
      $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: strJson
      }).then((res) => {
        // success
        callback(res.data)
      }, (err) => {
        // error
        callback(null)
      })
    }

    this.postByHeader = function(url, strJson, header, callback) {
      $http({
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': header.token
        },
        data: strJson
      }).then((res) => {
        // success
        callback(res.data)
      }, (err) => {
        // error
        callback(null)
      })
    }

    this.clearToken = function() {
      $timeout(() => {
        $window.sessionStorage.token = ''
        $window.sessionStorage.role = ''
        $window.sessionStorage.fleetid = ''
        $window.sessionStorage.fleetname = ''

        // $window.sessionStorage.user_id = ''
        // $window.sessionStorage.token = ''
        // $window.sessionStorage.role_id = ''
        // $window.sessionStorage.role_name = ''
        // $window.sessionStorage.group_id = ''
        // $window.sessionStorage.group_name = ''
        // $window.sessionStorage.sub_group_id = ''
        // $window.sessionStorage.sub_group_name = ''
        $window.sessionStorage.url_avatar = ''
        $window.sessionStorage.firstname = ''
        $window.sessionStorage.lastname = ''
        // $window.sessionStorage.email = ''
        // $window.sessionStorage.phone_number = ''
        $rootScope.authentication = $window.sessionStorage
        $location.path(`/${$rootScope.url_lang}/login`)
      }, 500)
    }

    this.confirmLogout = function() {
      $rootScope.$broadcast('logout')
    }

    this.toggleModalLogout = function() {
      $rootScope.$broadcast('modalLogout:toggle')
    }

    this.toggleModalMessage = function(data) {
      $rootScope.$broadcast('modalMessage:toggle', data)
    }

    this.toggleAlertMessage = function(data) {
      $rootScope.$broadcast('alertMessage:toggle', data)
    }

    this.formatTextDateTime = function(datetime) {
      return moment(datetime).format('MMMM Do YYYY, HH:mm:ss')
    }

    this.diffDuration = function(datetime) {
      const _now = moment()
      const _last = moment(datetime).format('YYYY-MM-DD HH:mm:ss')

      const _diff = _now.diff(_last)
      const _diffDuration = moment.duration(_diff)

      const _years = _diffDuration.years()
      const _months = _diffDuration.months()
      const _days = _diffDuration.days()
      const _hours = _diffDuration.hours()
      const _minutes = _diffDuration.minutes()

      return {
        years: _years,
        months: _months,
        days: _days,
        hours: _hours,
        minutes: _minutes
      }
    }

    this.diffDateTime = function(datetime1, datetime2) {
      const _now = moment(datetime1)
      const _last = moment(datetime2)

      const _diff = _now.diff(_last)
      const _diffDuration = moment.duration(_diff)

      const _years = _diffDuration.years()
      const _months = _diffDuration.months()
      const _days = _diffDuration.days()
      const _hours = _diffDuration.hours()
      const _minutes = _diffDuration.minutes()
      const _seconds = _diffDuration.seconds()

      return {
        years: _years,
        months: _months,
        days: _days,
        hours: _hours,
        minutes: _minutes,
        seconds: _seconds
      }
    }

    this.diffBetweenDatetime = function(first_datetime, last_datetime) {
      const _first = moment(last_datetime)
      const _last = moment(first_datetime).format('YYYY-MM-DD HH:mm:ss')

      const _diff = _first.diff(_last)
      const _diffDuration = moment.duration(_diff)

      const _years = _diffDuration.years()
      const _months = _diffDuration.months()
      const _days = _diffDuration.days()
      const _hours = _diffDuration.hours()
      const _minutes = _diffDuration.minutes()

      return {
        years: _years,
        months: _months,
        days: _days,
        hours: _hours,
        minutes: _minutes
      }
    }

    this.calTime = function(num) {
      const hours = (num / 60)
      const rhours = Math.floor(hours)
      const minutes = (hours - rhours) * 60
      const rminutes = Math.round(minutes)
      return parseFloat(`${rhours}.${rminutes}`)
    }

    this.convertMinutes = function(num) {
      _days = Math.floor(num / 1440) // 60 * 24
      _hours = Math.floor((num - (_days * 1440)) / 60)
      _minutes = Math.round(num % 60)
      return {
        days: _days,
        hours: _hours,
        minutes: _minutes
      }
    }
    
    this.formatTextDiff = function(diff) {
      let text_last
      if (diff.years > 0) {
        text_last = `${diff.years}${$rootScope.text.datetime.years}`
      } else if (diff.months > 0) {
        text_last = `${diff.months}${$rootScope.text.datetime.months}`
      } else if (diff.days > 0) {
        text_last = `${diff.days}${$rootScope.text.datetime.days}`
      } else if (diff.hours > 0) {
        text_last = `${diff.hours}${$rootScope.text.datetime.hours}`
      } else if (diff.minutes > 0) {
        text_last = `${diff.minutes}${$rootScope.text.datetime.minutes}`
      } else {
        text_last = `${$rootScope.text.datetime.now}`
      }
      return text_last
    }

    this.checkDecimal = function(value) {
      const decimal = /^[-+]?[0-9]+$/, _decimal = /^[-+]?[0-9]+\.[0-9]+$/
      if (value.match(decimal) || value.match(_decimal)) { 
        return true
      } else { 
        return false
      }
    }

    this.uploadFile = function(file, url, callback) {
      const fd = new FormData()
      fd.append('file', file)

      $http({
        method: 'POST',
        url: url,
        headers: { 'Content-Type': undefined },
        data: fd
      }).then(function (res) {
        // success
        callback(res.data)
      }, function (err) {
        // error
        callback(null)
      })
    }

    this.layerOsm = function() {
      const osm_url = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      const osm_attr = '&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      return L.tileLayer(osm_url, {id: 'OpenStreetMap', attribution: osm_attr})
    }

    this.layerEsri = function() {
      const mapLink = '<a href="http://www.esri.com/">Esri</a>'
      const wholink = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      const esri_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      const esri_attr = '&copy ' + mapLink + ', ' + wholink
      return L.tileLayer(esri_url, {id: 'Esri', attribution: esri_attr})
    }

    this.baseLayers = function() {
      return {
        OpenStreetMap: this.layerOsm(),
        Esri: this.layerEsri()
      }
    }

    this.centerMap = function() {
      return [13.767734, 100.5351375]
    }

    this.zoomMap = function() {
      return 9
    }

    const editableLayers = new L.FeatureGroup()
    this.editableLayers = function() {
      return editableLayers
    }

    const editableAreas = new L.FeatureGroup()
    this.editableAreas = function() {
      return editableAreas
    }

    const editablePolygon = new L.FeatureGroup()
    this.editablePolygon = function() {
      return editablePolygon
    }

    this.drawOptions = function() {
      const options = {
        position: 'topleft',
        draw: {
          polyline: false,
          polygon: {
            metric: true,
            showArea: true,
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Oh snap!<strong> you can\'t draw that!'
            },
            shapeOptions: {
              color: '#FF3399'
            }
          },
          rectangle: {
            metric: true,
            shapeOptions: {
              color: '#00CC66'
            }
          },
          circle: {
            metric: true,
            showArea: true,
            shapeOptions: {
              color: '#FFCC00'
            }
          },
          marker: true
        },
        edit: {
          featureGroup: this.editableLayers(),
          remove: true
        }
      }
      return options
    }

    this.drawArea = function() {
      const options = {
        position: 'topleft',
        draw: {
          polyline: false,
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false
        },
        edit: false
      }
      return options
    }

    this.drawPolygon = function() {
      const options = {
        position: 'topleft',
        draw: {
          polyline: false,
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false
        },
        edit: {
          featureGroup: this.editablePolygon(),
          remove: false
        }
      }
      return options
    }

    this.setTemplatePopupTrackingRealtime = function(data) {
      let strMessage = `
        <div class="popup-tracking-realtime">
          <label>${$rootScope.text.popup_tracking_realtime.car_name}</label> ${data.vehicle_name}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.car_license}</label> ${data.car_licence}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.lat_lon}</label> ${data.lat}, ${data.lon}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.speed}</label> ${data.speed}<br/>
        `
      if ($window.sessionStorage.lang === 'en') {
        strMessage += `
          <label>${$rootScope.text.popup_tracking_realtime.sub_district}</label> ${data.etambol}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.district}</label> ${data.eamphur}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.province}</label> ${data.eprovince}<br/>
        `
      } else if ($window.sessionStorage.lang === 'th') {
        strMessage += `
          <label>${$rootScope.text.popup_tracking_realtime.sub_district}</label> ${data.tambol}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.district}</label> ${data.amphur}<br/>
          <label>${$rootScope.text.popup_tracking_realtime.province}</label> ${data.province}<br/>
        `
      }
      strMessage += `
        <label>${$rootScope.text.popup_tracking_realtime.gps_datetime}</label> ${data.gps_datetime}<br/>
        <label>${$rootScope.text.popup_tracking_realtime.google_map}</label><a class="btn-click" href="https://www.google.com/maps?q=${data.lat},${data.lon}" target="_blank"> ${$rootScope.text.popup_tracking_realtime.map_click} <i class="fa fa-map"></i></a><br/>
        <label>${$rootScope.text.popup_tracking_realtime.station}</label><span class="btn-click" ng-click="drawStation('${data.lat}, ${data.lon}')"> ${$rootScope.text.popup_tracking_realtime.station_click} <i class="fa fa-map-marker"></i></span><br/>
      `
      if (parseInt(data.status) == 2) {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-yellow">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 3) {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-green">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 4) {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-blue">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 5) {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-blue">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 7) {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-purple">${this.statusTextTracking(data.status)}</span><br/>`
      } else {
        strMessage += `<label>${$rootScope.text.popup_tracking_realtime.status}</label> <span class="badge bg-red">${this.statusTextTracking(data.status)}</span><br/>`
      }
      strMessage += `
        <label>${$rootScope.text.popup_tracking_realtime.working}</label> ${this.calWorkingHour(data.working_hour, data.calibrate_working_hour)} <span>${$rootScope.text.popup_tracking_realtime.hour}</span><br/>
        <label>${$rootScope.text.popup_tracking_realtime.fuel}</label> ${this.setOilLiter(data.oil_liter)} <span>${$rootScope.text.popup_tracking_realtime.liter}</span><br/>
      `
      strMessage += `<label>${$rootScope.text.popup_tracking_realtime.service}</label><div class="popup-send-note input-group"><input class="form-control" type="text" ng-model="note.message_service"><span class="input-group-btn"><button class="btn btn-primary btn-flat" ng-click="sendNote(note, '${data.modem_id}', 'service')" type="button"><i class="fa fa-paper-plane-o"></i></button></span></div>`
      strMessage += `<label>${$rootScope.text.popup_tracking_realtime.repair}</label><div class="popup-send-note input-group"><input class="form-control" type="text" ng-model="note.message_repair"><span class="input-group-btn"><button class="btn btn-primary btn-flat" ng-click="sendNote(note, '${data.modem_id}', 'repair')" type="button"><i class="fa fa-paper-plane-o"></i></button></span></div>`
      strMessage += `<label>${$rootScope.text.popup_tracking_realtime.consult}</label><div class="popup-send-note input-group"><input class="form-control" type="text" ng-model="note.message_consult"><span class="input-group-btn"><button class="btn btn-primary btn-flat" ng-click="sendNote(note, '${data.modem_id}', 'consult')" type="button"><i class="fa fa-paper-plane-o"></i></button></span></div></div>`
      return strMessage;
    }

    this.setTemplatePopupTrackingHistory = function(data) {
      let strMessage = `
        <div class="popup-tracking-history">
          <label>${$rootScope.text.popup_tracking_history.car_name}</label> ${data.vehicle_name}<br/>
          <label>${$rootScope.text.popup_tracking_history.car_license}</label> ${data.car_licence}<br/>
          <label>${$rootScope.text.popup_tracking_history.lat_lon}</label> ${data.lat}, ${data.lon}<br/>
          <label>${$rootScope.text.popup_tracking_history.speed}</label> ${data.speed}<br/>
      `
      if ($window.sessionStorage.lang === 'en') {
        strMessage += `
          <label>${$rootScope.text.popup_tracking_history.sub_district}</label> ${data.etambol}<br/>
          <label>${$rootScope.text.popup_tracking_history.district}</label> ${data.eamphur}<br/>
          <label>${$rootScope.text.popup_tracking_history.province}</label> ${data.eprovince}<br/>
        `
      } else if ($window.sessionStorage.lang == 'th') {
        strMessage += `
          <label>${$rootScope.text.popup_tracking_history.sub_district}</label> ${data.tambol}<br/>
          <label>${$rootScope.text.popup_tracking_history.district}</label> ${data.amphur}<br/>
          <label>${$rootScope.text.popup_tracking_history.province}</label> ${data.province}<br/>
        `
      }
      strMessage += `
        <label>${$rootScope.text.popup_tracking_history.gps_time}</label> ${data.gps_datetime}<br/>
        <label>${$rootScope.text.popup_tracking_history.google_map}</label><a href="https://www.google.com/maps?q=${data.lat},${data.lon}" target="_blank"> ${$rootScope.text.popup_tracking_history.map_click} <i class="fa fa-map"></i></a><br/>
        <label>${$rootScope.text.popup_tracking_history.station}</label><span class="btn-click" ng-click="drawStation('${data.lat}, ${data.lon}')"> ${$rootScope.text.popup_tracking_history.station_click} <i class="fa fa-map-marker"></i></span><br/>
      `
      if (parseInt(data.status) == 2) {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-yellow">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 3) {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-green">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 4) {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-blue">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 5) {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-blue">${this.statusTextTracking(data.status)}</span><br/>`
      } else if (parseInt(data.status) == 7) {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-purple">${this.statusTextTracking(data.status)}</span><br/>`
      } else {
        strMessage += `<label>${$rootScope.text.popup_tracking_history.status}</label> <span class="badge bg-red">${this.statusTextTracking(data.status)}</span><br/>`
      }
      strMessage += `
        <label>${$rootScope.text.popup_tracking_history.fuel}</label> ${data.oil_liter} <span>${$rootScope.text.popup_tracking_history.liter}</span><br/>
      `
      return strMessage
    }

    this.setTemplatePopupGeom = function(data, edit = false) {
      let strMessage = `
        <div class="popup-geom">
          <label>${$rootScope.text.popup_geom.station_name}</label> ${data.station_name}<br/>
      `
      if (parseInt(data.station_type) == 1) {
        strMessage += `<label>${$rootScope.text.popup_geom.station_type}</label> ${$rootScope.text.station_type.station}<br/>`
      } else if (parseInt(data.station_type) == 2) {
        strMessage += `<label>${$rootScope.text.popup_geom.station_type}</label> ${$rootScope.text.station_type.safe_zone}<br/>`
      } else if (parseInt(data.station_type) == 3) {
        strMessage += `<label>${$rootScope.text.popup_geom.station_type}</label> ${$rootScope.text.station_type.danger_zone}<br/>`
      }
      if (edit) {
        strMessage += `
          <div class="box-edit-info" id="popup_station_${data.station_id}">
            <span class="btn-edit-info" ng-click="updateInfoGeom('${data.station_id}', '${data.station_name}', '${data.station_type}')">${$rootScope.text.popup_geom.station_edit}</span>
          </div></div>
        `
      } else {
        strMessage += `</div>`
      }
      return strMessage
    }

    this.setTextLocation = function(data) {
      if (data) {
        let text_location
        if ($rootScope.url_lang === 'en') {
          text_location = `${$rootScope.text.text_location.sub_district} ${data.etambol} ${$rootScope.text.text_location.district} ${data.eamphur} ${$rootScope.text.text_location.province} ${data.eprovince}`
        } else if ($rootScope.url_lang === 'th') {
          text_location = `${$rootScope.text.text_location.sub_district} ${data.tambol} ${$rootScope.text.text_location.district} ${data.amphur} ${$rootScope.text.text_location.province} ${data.province}`
        }
        return text_location
      } else {
        return null
      }
    }

    this.customizeTextLocation = function(str) {
      const res = str.split(":")
      return `${$rootScope.text.text_location.sub_district}${res[0]} ${$rootScope.text.text_location.district}${res[1]} ${$rootScope.text.text_location.province}${res[2]}`
    }

    this.statusTextTracking = function(status) {
      let str = $rootScope.text.status_tracking.parking
      switch (parseInt(status)) {
        case 2:
          str = $rootScope.text.status_tracking.ideling
          break
        case 3:
          str = $rootScope.text.status_tracking.working
          break
        case 4:
          str = $rootScope.text.status_tracking.cut_off
          break
        default:
          str = $rootScope.text.status_tracking.parking
          break
      }
      return str
    }

    this.calWorkingHour = function(working_hour, calibrate_working_hour) {
      return parseInt(working_hour) + parseInt(calibrate_working_hour)
    }

    this.setOilLiter = function(oil_liter) {
      return parseInt(oil_liter)
    }

    this.calDistance = function(lat1, lon1, lat2, lon2) {
      const R = 6371e3
      const _lat1  = lat1 * Math.PI/180
      const _lat2 = lat2 * Math.PI/180
      const _diff_lat = (lat2-lat1) * Math.PI/180
      const _diff_lon = (lon2-lon1) * Math.PI/180
      const a = Math.sin(_diff_lat/2) * Math.sin(_diff_lat/2) +
                Math.cos(_lat1 ) * Math.cos(_lat2) *
                Math.sin(_diff_lon/2) * Math.sin(_diff_lon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    }

    this.dec2Point = function(dec) {
      return parseFloat(dec).toFixed(2)
    }

    this.deg2rad = function(deg) {
      return (deg * Math.PI / 180.0)
    }

    this.rad2deg = function(rad) {
      return (rad * 180.0 / Math.PI)
    }

    this.calAngle = function(data) {
      const pxRes = parseFloat(data.now_lat) - parseFloat(data.last_lat)
      const pyRes = parseFloat(data.now_lon) - parseFloat(data.last_lon)
      let angle = 0.0
      if (pxRes == 0.0) {
        if (pxRes == 0.0) {
          angle = 0.0
        } else if (pyRes > 0.0) {
          angle = Math.PI / 2.0
        } else {
          angle = Math.PI * 3.0 / 2.0
        }
      } else if (pyRes == 0.0) {
        if (pxRes > 0.0) {
          angle = 0.0
        } else {
          angle = Math.PI
        }
      } else {
        if (pxRes < 0.0) {
          angle = Math.atan(pyRes / pxRes) + Math.PI
        } else if (pyRes < 0.0) {
          angle = Math.atan(pyRes / pxRes) + (2 * Math.PI)
        } else {
          angle = Math.atan(pyRes / pxRes)
        }
      }
      angle = angle * 180 / Math.PI
      return angle
    }

    this.calIconDirection = function(angle) {
      angle = parseFloat(angle)
      let _direction = 0
      if (angle >= 0 && angle < 22.5) {
        _direction = 0
      } else if (angle >= 22.5 && angle < 45) {
        _direction = 23
      } else if (angle >= 45 && angle < 67.5) {
        _direction = 45
      } else if (angle >= 67.5 && angle < 90) {
        _direction = 68
      } else if (angle >= 90 && angle < 112.5) {
        _direction = 90
      } else if (angle >= 112.5 && angle < 135) {
        _direction = 113
      } else if (angle >= 135 && angle < 157.5) {
        _direction = 135
      } else if (angle >= 157.5 && angle < 180) {
        _direction = 158
      } else if (angle >= 180 && angle < 202.5) {
        _direction = 180
      } else if (angle >= 202.5 && angle < 225) {
        _direction = 203
      } else if (angle >= 225 && angle < 247.5) {
        _direction = 225
      } else if (angle >= 247.5 && angle < 270) {
        _direction = 248
      } else if (angle >= 270 && angle < 292.5) {
        _direction = 270
      } else if (angle >= 292.5 && angle < 315) {
        _direction = 293
      } else if (angle >= 315 && angle < 337.5) {
        _direction = 315
      } else if (angle >= 337.5 && angle < 360) {
        _direction = 338
      } else {
        _direction = 0
      }
      return _direction
    }

    this.calDirection = function(angle) {
      angle = parseFloat(angle)
      let _direction = 'N'
      // For 8 Direction
      // if (angle >= 0 && angle < 45) {
      //   _direction = 'N'
      // } else if (angle >= 45 && angle < 90) {
      //   _direction = 'NE'
      // } else if (angle >= 90 && angle < 135) {
      //   _direction = 'E'
      // } else if (angle >= 135 && angle < 180) {
      //   _direction = 'SE'
      // } else if (angle >= 180 && angle < 225) {
      //   _direction = 'S'
      // } else if (angle >= 225 && angle < 270) {
      //   _direction = 'SW'
      // } else if (angle >= 270 && angle < 315) {
      //   _direction = 'W'
      // } else if (angle >= 315 && angle < 360) {
      //   _direction = 'NW'
      // } else {
      //   _direction = 'N'
      // }
      // For 16 Direction
      if (angle >= 0 && angle < 22.5) {
        _direction = 'N'
      } else if (angle >= 22.5 && angle < 45) {
        _direction = 'NNE'
      } else if (angle >= 45 && angle < 67.5) {
        _direction = 'NE'
      } else if (angle >= 67.5 && angle < 90) {
        _direction = 'ENE'
      } else if (angle >= 90 && angle < 112.5) {
        _direction = 'E'
      } else if (angle >= 112.5 && angle < 135) {
        _direction = 'ESE'
      } else if (angle >= 135 && angle < 157.5) {
        _direction = 'SE'
      } else if (angle >= 157.5 && angle < 180) {
        _direction = 'SSE'
      } else if (angle >= 180 && angle < 202.5) {
        _direction = 'S'
      } else if (angle >= 202.5 && angle < 225) {
        _direction = 'SSW'
      } else if (angle >= 225 && angle < 247.5) {
        _direction = 'SW'
      } else if (angle >= 247.5 && angle < 270) {
        _direction = 'WSW'
      } else if (angle >= 270 && angle < 292.5) {
        _direction = 'W'
      } else if (angle >= 292.5 && angle < 315) {
        _direction = 'WNW'
      } else if (angle >= 315 && angle < 337.5) {
        _direction = 'NW'
      } else if (angle >= 337.5 && angle < 360) {
        _direction = 'NNW'
      } else {
        _direction = 'N'
      }
      return _direction
    }

    this.checkDriverTypeCard = function(str) {
      if (parseInt(str) == 11) {
        return $rootScope.text.driver_type_card[0]
      } else if (parseInt(str) == 21) {
        return $rootScope.text.driver_type_card[1]
      } else if (parseInt(str) == 14) {
        return $rootScope.text.driver_type_card[2]
      } else if (parseInt(str) == 13) {
        return $rootScope.text.driver_type_card[3]
      } else if (parseInt(str) == 12) {
        return $rootScope.text.driver_type_card[4]
      } else if (parseInt(str) == 24) {
        return $rootScope.text.driver_type_card[5]
      } else if (parseInt(str) == 23) {
        return $rootScope.text.driver_type_card[6]
      } else if (parseInt(str) == 22) {
        return $rootScope.text.driver_type_card[7]
      } else {
        return ''
      }
    }

    this.stationType = function() {
      return [
        { id: 1, text: $rootScope.text.station_type.station },
        { id: 2, text: $rootScope.text.station_type.safe_zone },
        { id: 3, text: $rootScope.text.station_type.danger_zone }
      ]
    }

    this.colorBadge = (status) => {
      if (parseInt(status) == 2) return 'badge bg-yellow'
      else if (parseInt(status) == 3) return 'badge bg-green'
      else if (parseInt(status) == 4) return 'badge bg-grey'
      else return 'badge bg-red'
    }

    this.statusTextColor = function(status) {
      if (parseInt(status) == 2) return 'status-yellow'
      else if (parseInt(status) == 3) return 'status-green'
      else if (parseInt(status) == 4) return 'status-grey'
      else return 'status-red'
    }

    this.checkSizeObject = function(obj) {
      let size = 0, key
      Object.entries(obj).forEach(([key, value]) => {
        if (obj.hasOwnProperty(key)) size++
      })
      return size
    }

    this.back = function() {
      $window.history.back()
    }
    
    this.openModalMap = function(data) {
      let obj = [], lonlat, start, end, only_start = true
      if (data.hasOwnProperty('lonlat')) {
        lonlat = data.lonlat.split(",")
        only_start = true
      } else if (data.hasOwnProperty('xlonlat')) {
        lonlat = data.xlonlat.split(",")
        only_start = true
      } else if (data.hasOwnProperty('lat') && data.hasOwnProperty('lon')) {
        lonlat = [String(data.lon), String(data.lat)]
        only_start = true
      }
      if (data.hasOwnProperty('start_lonlat') && data.hasOwnProperty('end_lonlat')) {
        start = data.start_lonlat.split(",")
        end = data.end_lonlat.split(",")
        only_start = false
      } else if (data.hasOwnProperty('xstart_lonlat') && data.hasOwnProperty('xend_lonlat')) {
        start = data.xstart_lonlat.split(",")
        end = data.xend_lonlat.split(",")
        only_start = false
      }
      if (only_start) {
        if ($rootScope.url_lang == 'th') {
          if (data.hasOwnProperty('start_loc_th')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.start_loc_th)
            })
          } else if (data.hasOwnProperty('xstart_loc_th')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.xstart_loc_th)
            })
          } else if (data.hasOwnProperty('locations_th')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.locations_th)
            })
          } else if (data.hasOwnProperty('tambol') && data.hasOwnProperty('amphur') && data.hasOwnProperty('province')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.setTextLocation(data)
            })
          }
        } else {
          if (data.hasOwnProperty('start_loc_en')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.start_loc_en)
            })
          } else if (data.hasOwnProperty('xstart_loc_en')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.xstart_loc_en)
            })
          } else if (data.hasOwnProperty('locations_en')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.customizeTextLocation(data.locations_en)
            })
          } else if (data.hasOwnProperty('etambol') && data.hasOwnProperty('eamphur') && data.hasOwnProperty('eprovince')) {
            obj.push({
              latitude: parseFloat(lonlat[1]),
              longitude: parseFloat(lonlat[0]),
              address: this.setTextLocation(data)
            })
          }
        }
      } else {
        if ($rootScope.url_lang == 'th') {
          if (data.hasOwnProperty('start_loc_th') && data.hasOwnProperty('end_loc_th')) {
            obj.push({
              latitude: parseFloat(start[1]),
              longitude: parseFloat(start[0]),
              address: this.customizeTextLocation(data.start_loc_th)
            })
            obj.push({
              latitude: parseFloat(end[1]),
              longitude: parseFloat(end[0]),
              address: this.customizeTextLocation(data.end_loc_th)
            })
          } else if (data.hasOwnProperty('xstart_loc_th') && data.hasOwnProperty('xend_loc_th')) {
            obj.push({
              latitude: parseFloat(start[1]),
              longitude: parseFloat(start[0]),
              address: this.customizeTextLocation(data.xstart_loc_th)
            })
            obj.push({
              latitude: parseFloat(end[1]),
              longitude: parseFloat(end[0]),
              address: this.customizeTextLocation(data.xend_loc_th)
            })
          }
        } else {
          if (data.hasOwnProperty('start_loc_en') && data.hasOwnProperty('end_loc_en')) {
            obj.push({
              latitude: parseFloat(start[1]),
              longitude: parseFloat(start[0]),
              address: this.customizeTextLocation(data.start_loc_en)
            })
            obj.push({
              latitude: parseFloat(end[1]),
              longitude: parseFloat(end[0]),
              address: this.customizeTextLocation(data.end_loc_en)
            })
          } else if (data.hasOwnProperty('xstart_loc_en') && data.hasOwnProperty('xend_loc_en')) {
            obj.push({
              latitude: parseFloat(start[1]),
              longitude: parseFloat(start[0]),
              address: this.customizeTextLocation(data.xstart_loc_en)
            })
            obj.push({
              latitude: parseFloat(end[1]),
              longitude: parseFloat(end[0]),
              address: this.customizeTextLocation(data.xend_loc_en)
            })
          }
        }
      }
      $rootScope.$broadcast('toggleModalMap', obj)
    }
  }
])
