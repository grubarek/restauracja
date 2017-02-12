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


appControllers.controller("AdminCtrl", ['$scope', '$window', '$http', 'AddProductRest', 'ProductRest', 'Products', 'OrderList', 'Reservation',
    function ($scope, $window, $http, AddProductRest, ProductRest, Products, OrderList, Reservation) {

        $scope.files = [];
        $scope.file = {};
        $scope.productList = Products.query();
        $scope.reservatons = Reservation.query();
        $scope.orderList = OrderList.query();

        $scope.showAdminOrder = false;
        $scope.showAdminReservation = false;

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
            $window.alert("Dodano !!!");
            // Clear input fields after push
            $scope.price = '';
            $scope.description = '';
            $scope.art = '';
            $scope.category = '';
            $scope.data = "";
            $scope.active = '';
        };


    }]);


appControllers.controller("SliderCtrl", ['$scope',
    function ($scope) {
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

appControllers.controller("OrderCtrl", ['$scope', '$http', '$window', 'Order', 'OrderList', 'ProductRest', 'BuyOrder', 'BasketStorage', 'Reservation',
    function ($scope, $http, $window, Order, OrderList, ProductRest, BuyOrder, BasketStorage, Reservation) {

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

        $scope.sendReservation = function () {
            var newReservation = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                reservationDate: $scope.reservationDate,
                persons: $scope.persons,
                table: $scope.table
            };
            Reservation.addReservation(newReservation);
            // Clear input fields after push
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
            $scope.reservationDate = '';
            $scope.persons = '';
            $scope.table = '';
            $window.alert("Zamowiono !!!");
        };

        $scope.sendOrder = function () {
            // var productsToSend = [];
            // var product = {};
            // for (var i=0; $scope.productList.length ; i++) {
            //     product = $scope.productList[i];
            //     product.contentData = "";
            //     product.contentType = "";
            //     productsToSend.push(product);
            // }
            var newOrder = {
                firstName: $scope.first,
                lastName: $scope.last,
                city: $scope.city,
                zipCode: $scope.zipCode,
                street: $scope.street,
                localNumber: $scope.houseNo,
                orderTime: $scope.orderTime,
                products: $scope.productList
            };
            BuyOrder.buyQuery(newOrder);
            // Clear input fields after push
            $scope.first = '';
            $scope.last = '';
            $scope.city = '';
            $scope.street = '';
            $scope.houseNo = '';
            $scope.orderTime = '';
            $window.alert("Zamowiono !!!");
        };


    }]);

