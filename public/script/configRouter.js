angular.module('arkeneaApp')
.config(
	['$stateProvider', '$urlRouterProvider','$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		// $locationProvider.html5Mode({
		// 	enabled: true,
		// 	requireBase: false
		// });
		$urlRouterProvider
		.otherwise('/home');

		$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'tpl/home.html',
		});

		$stateProvider
		.state('view', {
			url: '/view/:userID',
			templateUrl: 'tpl/view.html',
		})


	}]);