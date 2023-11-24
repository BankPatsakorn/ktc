angular.module('graph').config(['$routeProvider',
  ($routeProvider) => {
    $routeProvider
      .when('/:lang/graph_usage_vehicle', {
        templateUrl: 'graph/views/graph_usage_vehicle.client.view.html'
      })
      .when('/:lang/graph_efficient', {
        templateUrl: 'graph/views/graph_efficient.client.view.html'
      })
      .when('/:lang/graph_over_speed', {
        templateUrl: 'graph/views/graph_over_speed.client.view.html'
      })
      .when('/:lang/graph_working_hours', {
        templateUrl: 'graph/views/graph_working_hours.client.view.html'
      })
      .when('/:lang/graph_fuel', {
        templateUrl: 'graph/views/graph_fuel.client.view.html'
      })
      .otherwise({
        redirectTo: '/'
      })
  }
])
