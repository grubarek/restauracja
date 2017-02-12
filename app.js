var shopApp = angular.module('shopApp', ['ngRoute', 'appControllers', 'appServices', 'ngAnimate', 'naif.base64']);

shopApp.animation('.fade', function () {
    return {
        enter: function (element, done) {
            element.css('display', 'none');
            $(element).fadeIn(1000, function () {
                done();
            });
        },
        leave: function (element, done) {
            $(element).fadeOut(1000, function () {
                done();
            });
        },
        move: function (element, done) {
            element.css('display', 'none');
            $(element).slideDown(500, function () {
                done();
            });
        }
    }
});

shopApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/products', {
        templateUrl: 'views/products.html',
        controller: 'ProductCtrl',
    }).when('/users', {
        templateUrl: 'views/administrate.html',
        controller: 'ProductCtrl'
    }).when('/basket', {
        templateUrl: 'views/order.html',
        controller: 'OrderCtrl'
    }).when('/confirm', {
        templateUrl: 'views/confirm.html',
        controller: 'OrderCtrl'
    }).when('/administrate', {
        templateUrl: 'views/administrate.html',
        controller: 'AdminCtrl'
    }).otherwise({
        redirectTo: $routeProvider
    });
}]);
