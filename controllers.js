Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj))
};

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key))
};

appControllers.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


appControllers.controller("AdminCtrl", ['$scope', '$window', '$http', 'AddProductRest', 'ProductRest', 'Products',
    function ($scope, $window, $http, AddProductRest, ProductRest, Products) {

        $scope.files = [];
        $scope.file = {};
        $scope.productList = Products.query();

        $scope.uploadFiles = function () {

            var files = angular.copy($scope.files);

            if ($scope.file) {
                console.log("sucess: " + $scope.file.toString());
            } else {
                $window.alert('Please select files!');
                return false;
            }
        };

        $scope.removeProduct = function (product) {
            var params = {_id: product._id};
            ProductRest.removeProduct(params);
        };


        $scope.addProduct = function () {
            var newProduct = {
                price: $scope.price,
                description: $scope.description,
                name: $scope.name,
                category: $scope.category, //słownik ?
                contentData: $scope.file.base64,
                contentType: $scope.file.filetype
            };
            var data = new Date();
            newProduct.creationDate = data;
            //TODO dodanie do db.
            AddProductRest.addProduct(newProduct);
            // Clear input fields after push
            $scope.price = '';
            $scope.description = '';
            $scope.art = '';
            $scope.category = '';
            $scope.data = "";
            $scope.active = '';
        };


    }]);


appControllers.controller("SliderCtrl", ['$scope', '$http',
    function ($scope, $http) {
        $scope.slides = [
            {image: 'images/img00.jpg', description: 'Image 00'},
            {image: 'images/img01.jpg', description: 'Image 01'},
            {image: 'images/img02.jpg', description: 'Image 02'},
            {image: 'images/img03.jpg', description: 'Image 03'},
            {image: 'images/img04.jpg', description: 'Image 04'}
        ];

        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };


    }]);


appControllers.controller("ProductCtrl", ['$scope', '$http', 'ProductRest', 'Products', 'AddProductRest', 'BuyOrder', 'BasketStorage',
    function ($scope, $http, ProductRest, Products, AddProductRest, BuyOrder, BasketStorage) {


// Add a Item to the order

        $scope.products = Products.query();
        $scope.shopingList = [];

        $scope.productLog = function () {
            console.log("Saved product:");
            for (var i = 0; i < $scope.productList.length; i++) {
                var currentProduct = $scope.productList[i];
                console.log("Saved product: " + currentProduct.name + "\n");
            }
        };
        $scope.order = function (product) {
            $scope.shopingList.push(product);
            console.log(product.toString());
            BasketStorage.addProduct(product)
        };


// Get Total Items
        $scope.getTotalItems = function () {
            var buckedSize = BasketStorage.getProducts().length;
            if (buckedSize == null) {
                buckedSize = 0;
            }
            return buckedSize;
        };

// Paginate
        $scope.currentPage = 0;
        $scope.pageSize = 9;
        $scope.numberOfPages = function () {
            return Math.ceil($scope.products.length / $scope.pageSize);
        };

        for (var i = 0; i < $scope.products.length; i++) {
            $scope.outputData.push($scope.products[i]);
        }


        $scope.getTotalCheckedItems = function () {
            var sizeCheckedItems = 0;
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].active === true) {
                    sizeCheckedItems++;
                }
            }
            $scope.active = sizeCheckedItems;
            return sizeCheckedItems;
        };

    }]);

appControllers.controller("OrderCtrl", ['$scope', '$http', 'Order', 'OrderList', 'ProductRest', 'BuyOrder', 'BasketStorage',
    function ($scope, $http, Order, OrderList, ProductRest, BuyOrder, BasketStorage) {

        $scope.productList = BasketStorage.getProducts();
        // calling our submit function.

        $scope.removeProductOrder = function (product) {
            BasketStorage.removeProduct(product);
            $scope.productList = BasketStorage.getProducts();
        };

        $scope.orderSum = function () {
            var tempSum = 0;
            for (var i = 0; i < $scope.productList.length; i++) {
                console.log(tempSum + " add to sum " + $scope.productList[i].price);
                tempSum += $scope.productList[i].price;
            }
            return tempSum;
        };

        $scope.saveBasket = function () {
            for (var i = 0; i < $scope.productList.length; i++) {
                var currentProduct = $scope.productList[i];
                console.log("Saved product: " + currentProduct.name + "\n");
                if ($scope.activeUser != null) {
                    User.query($scope.activeUser);
                    var users = Users.query();
                    console.log("Active user: " + $scope.activeUser.lastName);

                    for (var j = 0; i < users.length; j++) {
                        console.log(users[j].nick);
                        if (users[j].nick.isEqual($scope.activeUser.nick)) {
                            $scope.activeUser._id = users[j]._id;
                        }
                    }
                }
                var currentBasket = {
                    userId: $scope.activeUser._id,
                    productId: currentProduct._id
                };
                BuyOrder.buyQuery(currentBasket);
                $scope.basket.push(currentBasket);
            }
        };
    }]);

