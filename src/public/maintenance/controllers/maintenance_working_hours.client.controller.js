angular.module('maintenance').controller('MaintenanceWorkingHoursController', ['$rootScope', '$scope', '$iService', 'maintenanceWorkingHoursFactory',
  ($rootScope, $scope, $iService, maintenanceWorkingHoursFactory) => {

    $scope.$iService = $iService
    
    $scope.modalMaintenanceWorkingHours = {}

    maintenanceWorkingHoursFactory.getMaintenanceWorkingHours(res => {
      if (res.length > 0) {
        $scope.dataMaintenanceWorkingHours = res
      } else {
        $scope.dataMaintenanceWorkingHours = []
      }
    })

    $scope.toggleModalEdit = (data) => {
      $scope.modalMaintenanceWorkingHours.editModal(data)
    }

    $scope.confirmEdit = (data) => {
      if (data.modem_id != "" && data.modem_id != null && data.modem_id !== '0' &&
        $iService.checkDecimal(data.hour_start_service.toString()) ) {
        if (data.edit) {
          maintenanceWorkingHoursFactory.editMaintenanceWorkingHours(data, res => {
            if (res.length > 0) {
              const _modem_id = $scope.dataMaintenanceWorkingHours.map((_data) => (_data.modem_id))
              const _index = _modem_id.indexOf(data.modem_id)
              if (_index != -1) {
                $scope.dataMaintenanceWorkingHours[_index]["hour_start_service"] = res[0]["hour_start_service"]
                $scope.dataMaintenanceWorkingHours[_index]["hour_left_send_alert"] = res[0]["hour_left_send_alert"]
                $scope.dataMaintenanceWorkingHours[_index]["waranty_expiration_date"] = res[0]["waranty_expiration_date"]
                $scope.dataMaintenanceWorkingHours[_index]["date_left_send_alert"] = res[0]["date_left_send_alert"]
                $scope.dataMaintenanceWorkingHours[_index]["hour_left_waranty"] = res[0]["hour_left_waranty"]
                $iService.toggleModalMessage({
                  title: $rootScope.text.page_maintenance_working_hours.alert_title_success,
                  detail: $rootScope.text.page_maintenance_working_hours.alert_detail_success
                })
              } else {
                $iService.toggleModalMessage({
                  title: $rootScope.text.page_maintenance_working_hours.alert_title_error,
                  detail: $rootScope.text.page_maintenance_working_hours.alert_detail_error
                })
              }
            } else {
              $iService.toggleModalMessage({
                title: $rootScope.text.page_maintenance_working_hours.alert_title_error,
                detail: $rootScope.text.page_maintenance_working_hours.alert_detail_error
              })
            }
          })
        }
      } else {
        $iService.toggleModalMessage({
          title: $rootScope.text.page_maintenance_working_hours.alert_title,
          detail: $rootScope.text.page_maintenance_working_hours.alert_blank
        })
      }
    }
  }
]).directive('modalMaintenanceWorkingHours', ['$rootScope',
  ($rootScope) => {
    return {
      templateUrl: 'maintenance/views/modal_maintenance_working_hours.client.view.html',
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        sharedobj: '=',
        modalConfirm: '&fnModalConfirm'
      },
      link: (scope, element, attrs) => {

        scope.confirmEdit = false
        scope.text = $rootScope.text

        scope.$watch(attrs.visible, value => {
          if (value == true)
            element.modal('show')
          else
            element.modal('hide')
        })

        element.on('shown.bs.modal', () => {
          scope.$apply(() => {
            scope.$parent[attrs.visible] = true
          })
        })

        element.on('hidden.bs.modal', () => {
          scope.$apply(() => {
            scope.$parent[attrs.visible] = false
            scope.inputWorkTimeNow = ""
            scope.inputWorkTimeService = ""
          })
        })

        scope.sharedobj.editModal = (data) => {
          scope.confirmEdit = true
          scope.modem_id = data.modem_id
          scope.inputWorkTimeNow = data.working_hour_now
          scope.inputWorkTimeService = data.hour_start_service
          element.modal('toggle')
        }

        scope.confirm = () => {
          scope.modalConfirm({
            data: {
              edit: scope.confirmEdit,
              modem_id: scope.modem_id,
              hour_start_service: scope.inputWorkTimeService
            }
          })
        }
      }
    }
  }
]).directive('tableMaintenanceWorkingHours', ['$rootScope', '$compile', '$iService', '$window', '$timeout',
  ($rootScope, $compile, $iService, $window, $timeout) => {
    return {
      restrict: 'AC',
      scope: {
        data: '@',
        modalEdit: '&fnToggleModalEdit',
      },
      link: (scope, element, attrs) => {

        let dataTable, isTableCreated = false, _height = $(window).height() - 270

        angular.element($window).bind('resize', () => {
          _height = $(window).height() - 270
          if (_height < 300) {
            _height = 300
          }
          scope.triggerSize()
          // manuall $digest required as resize event
          // is outside of angular
          scope.$digest()
        })

        scope.triggerSize = () => {
          if (isTableCreated) {
            element.parent().css({ 'max-height': _height, 'height': _height })
            element.each(function() { $(this).dataTable().fnDraw() })
          }
        }

        scope.setDataTable = (data) => {
          isTableCreated = true
          return element.DataTable({
            columns: [{
              title: $rootScope.text.page_maintenance_working_hours.table.box_no,
              data: data => data.modem_id,
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.vehicle_name,
              data: data => data.vehicle_name,
              responsivePriority: 1
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.work_time_now,
              data: data => data.working_hour_now
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.work_time_service,
              data: data => data.hour_start_service
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.due_left_check,
              data: data => data.due_date_service
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.left_hours,
              data: data => parseInt(data.hour_left_send_alert) < 0 ? `${$rootScope.text.page_maintenance_working_hours.status_over} ${Math.abs(parseInt(data.hour_left_send_alert))}` : `${$rootScope.text.page_maintenance_working_hours.status_left} ${data.hour_left_send_alert}`
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.waranty_expiration_date,
              data: data => data.waranty_expiration_date
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.waranty_left_date,
              data: data => parseInt(data.date_left_send_alert) < 0 ? `${$rootScope.text.page_maintenance_working_hours.status_over} ${Math.abs(parseInt(data.date_left_send_alert))}` : `${$rootScope.text.page_maintenance_working_hours.status_left} ${data.date_left_send_alert}`
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.waranty_expiration_hour,
              data: data => data.waranty_expiration_hour
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.left_hours,
              data: data => parseInt(data.hour_left_waranty) < 0 ? `${$rootScope.text.page_maintenance_working_hours.status_over} ${Math.abs(parseInt(data.hour_left_waranty))}` : `${$rootScope.text.page_maintenance_working_hours.status_left} ${data.hour_left_waranty}`
            }, {
              title: $rootScope.text.page_maintenance_working_hours.table.edit,
              data: data => `<button class="btn btn-warning btn-circle btn-list" ng-click='edit(${JSON.stringify(data)})' tooltip data-placement="top" data-title="${$rootScope.text.page_maintenance_working_hours.edit_tooltip}"><i class="fa fa-pencil-square-o"></i></button>`,
              className: "text-center",
              responsivePriority: 2
            }],
            fnCreatedRow: (nRow, aData, iDataIndex) => {
              if (parseInt(aData.hour_left_send_alert) < 0) {
                $(nRow).children().eq(5).addClass('highlight');
              }
              if (parseInt(aData.date_left_send_alert) < 0) {
                $(nRow).children().eq(7).addClass('highlight');
              }
              if (parseInt(aData.hour_left_waranty) < 0) {
                $(nRow).children().eq(9).addClass('highlight');
              }
              const linker = $compile(nRow)
              const element = linker(scope)
              return nRow = element
            },
            responsive: {
              details: {
                display: $.fn.dataTable.Responsive.display.modal({
                  header: row => $rootScope.text.page_maintenance_working_hours.title
                }),
                renderer: (api, rowIdx, columns) => {
                  const data = $.map(columns, (col, i) => {
                    let _class = ""
                    if (col.columnIndex == 5 || col.columnIndex == 7) {
                      if (col.data.indexOf($rootScope.text.page_maintenance_working_hours.status_over) != -1) {
                        _class = "highlight"
                      }
                    }
                    return `<tr>
                        <td class="td-modal-title"><b>${col.title}:</b></td>
                        <td class="td-modal-detail ${_class}">${col.data}</td>
                      </tr>`
                  }).join('')
                  const e = angular.element(`<table class="table-modal-customize">${data}</table>`)
                  const compiled = $compile(e)(scope)
                  return compiled[0]
                }
              }
            },
            scrollY: _height,
            scrollCollapse: true,
            paging: false,
            data: data,
            dom: 'Bfrtip',
            buttons: [
              {
                extend: 'colvis',
                text: function(dt, button, config) {
                  return dt.i18n('buttons.print', '<i class="fa fa-columns"></i> Column visibility')
                },
                className: 'btn btn-default btn-sm'
              }, {
                extend: 'copyHtml5',
                exportOptions: {
                  // columns: ':visible(:not(.not-export-col))'
                  columns: [ 0, 1, 2, 3 ]
                },
                title: $rootScope.text.page_maintenance_working_hours.table.export_title,
                text: function(dt, button, config) {
                  return dt.i18n('buttons.print', '<i class="fa fa-clipboard"> Copy to clipboard ')
                },
                className: 'btn btn-default btn-sm'
              }, {
                extend: 'excelHtml5',
                exportOptions: {
                  // columns: ':visible(:not(.not-export-col))'
                  columns: [ 0, 1, 2, 3 ]
                },
                text: function(dt, button, config) {
                  return dt.i18n('buttons.print', '<i class="fa fa-file-text-o"></i> Export .xlsx')
                },
                title: $rootScope.text.page_maintenance_working_hours.table.export_title,
                className: 'btn btn-default btn-sm'
              }
            ]
          })
        }

        scope.$watch('data', newValue => {
          if (newValue && typeof newValue === 'string') {
            newValue = JSON.parse(newValue)
            if (isTableCreated) {
              dataTable.clear()
              dataTable.rows.add(newValue)
              dataTable.draw()
            } else {
              dataTable = scope.setDataTable(newValue)
            }
            $timeout(() => {
              $(window).trigger('resize')
              element.each(function() { $(this).dataTable().fnDraw() })
            }, 1000)
          } else {
            if (dataTable) {
              dataTable.clear()
              dataTable.rows.add([])
              dataTable.draw()
            } else {
              dataTable = scope.setDataTable([])
            }
          }
        })

        scope.customizeTextLubricator = (status, leftmileage) => {
          if (status == "left") {
            return `${$rootScope.text.page_maintenance_working_hours.status_left}${(leftmileage).toFixed(0)}`
          } else if (status == "over") {
            return `${$rootScope.text.page_maintenance_working_hours.status_over}${(leftmileage).toFixed(0)}`
          } else {
            return null;
          }
        }

        scope.edit = data => scope.modalEdit({ data: data })
      }
    }
  }
])
