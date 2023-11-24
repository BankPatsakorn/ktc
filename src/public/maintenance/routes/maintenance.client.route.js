angular.module('maintenance').config(['$routeProvider',
  ($routeProvider) => {
    $routeProvider
      .when('/:lang/maintenance_lubricant', {
        templateUrl: 'maintenance/views/maintenance_lubricant.client.view.html'
      })
      .when('/:lang/maintenance_tire', {
        templateUrl: 'maintenance/views/maintenance_tire.client.view.html'
      })
      .when('/:lang/maintenance_working_hours', {
        templateUrl: 'maintenance/views/maintenance_working_hours.client.view.html'
      })
      .otherwise({
        redirectTo: '/'
      })
  }
])
