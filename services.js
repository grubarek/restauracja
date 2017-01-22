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

appServices.factory('Products', function($resource) {
    return $resource('http://localhost:5000/product', {}, {
        query: {
            method: 'GET',
            isArray:true
        }
    });
});


appServices.factory('ProductRest', function($resource) {
    return $resource('http://localhost:5000/product/:_id', {_id: '@id'}, {
        update: {
            method: 'PUT'
        },
        removeProduct: {
            method : 'DELETE'
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

appServices.factory('Reservation', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/reservation', {}, {
        query: {
            method: 'GET',
            isArray:true
        },
        addReservation: {
            method : "POST"
        }
    });
}
]);

appServices.factory('OrderList', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/order', {}, {
        query: {
            method: 'GET',
            isArray:true
        }
    });
}
]);

appServices.factory('Order', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/order/:orderId', {orderId: '@orderId'}, {
        query: {
            method: 'GET'
        },
        update: {
            method: 'PUT'
        },
        removeOrder: {
            method : 'DELETE'
        }
    });
}
]);

appServices.factory('BuyOrder', ['$resource', function ($resource) {
    return $resource('http://localhost:5000/order', {}, {
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

    var removeProduct = function (obj) {
        for (var i = 0; i <productList.length; i++) {
            if (productList[i] === obj)
            productList.splice(i, 1);
        }
    };


    return {
        addProduct: addProduct,
        getProducts: getProducts,
        removeProduct : removeProduct
    };
});
