/**
 * Created by pawel on 20.11.16.
 */
var appServices = angular.module('appServices', ['ngResource']);
appServices
    .factory('BaseApiURL', function (Restangular) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setDefaultHeaders({'Content-Type': 'application/json'});
            RestangularConfigurer.setBaseUrl('http://localhost:5000');
        });
    })
    .factory('ApiURL', ['BaseApiURL', function (BaseApiURL) {
        var rest_url = BaseApiURL;
        return {
            products: rest_url.all('products'),
            basket: rest_url.all('basket'),
            users: rest_url.all('user_list')
        };
    }]);


appServices.service('ProductService', ['BaseApiUrl', 'ApiURL', function (BaseApiURL, ApiURL) {
        this.products = function () {
            return ApiURL.products
                .withHttpConfig({timeout: Config.TIMEOUT_TIME * 1000})
                .get();
        };
    }]);


var appServices = angular.module('appServices', ['ngResource']);

appServices.factory('ProductRest', function($resource) {
    return $resource('http://localhost:5000/products', {}, {
        query: {
            method: 'GET',
            isArray:true
        }
    });
});

appServices.factory('AddProductRest', function($resource) {
    return $resource('http://localhost:5000/addProduct', {}, {
        addProduct: {
            method : "POST"
        }
    });
});

appServices.factory('Users', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/user_list', {}, {
        query: {
            method: 'GET',
            isArray:true
        }
    });
}
]);

appServices.factory('User', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/user/:userId', {}, {
        query: {
            method: 'POST'
        },
        find: {
            method: 'GET',
            params: {_id: 'userId'}
        }
    });
}
]);

appServices.factory('Basket', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/basked/:userId', {}, {
        query: {
            method: 'GET',
            params: {userId: 'userId'}
        }
    });
}
]);

appServices.factory('BuyRest', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/buy', {}, {
        buyQuery: {
            method: "POST"
        }
    });
}
]);

appServices.factory('BasketStorage', function() {
    var productList = [];

    var addProduct = function(newObj) {
        productList.push(newObj);
    };

    var getProducts = function(){
        return productList;
    };

    return {
        addProduct: addProduct,
        getProducts: getProducts
    };
});
