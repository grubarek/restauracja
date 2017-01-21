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


appControllers.controller("AdminCtrl", ['$scope', '$http', 'ProductRest', 'User', 'Users', function ($scope, $http, ProductRest, User, Users) {

    $scope.users = [];
    $scope.users = Users.query();
    $scope.products = ProductRest.query();


    $scope.addProduct = function () {
        var newProduct = {
            price: $scope.price,
            description: $scope.description,
            name: $scope.name,
            category: $scope.category, //słownik ?
            creationDate: data,
            active: false
        };
        var data = new Date();
        $scope.products.push(newProduct);
        //TODO dodanie do db.
        AddProductRest.addProduct(newProduct);
        // Clear input fields after push
        $scope.price = '';
        $scope.description = '';
        $scope.art = '';
        $scope.category = '';
        $scope.data = '';
        $scope.active = '';
    };


    $scope.addUser = function () {
        var newUser = {
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            nick: $scope.nick
        };
        $scope.users.push(newUser);
        User.query(newUser);

        $scope.firstName = '';
        $scope.lastName = '';
        $scope.nick = '';
    };

}]);

appControllers.controller("ProductCtrl", ['$scope', '$http', 'User', 'Users', 'ProductRest', 'AddProductRest', 'BuyRest', 'BasketStorage',
    function ($scope, $http, User, Users, ProductRest, AddProductRest, BuyRest, BasketStorage) {


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



// Add a Item to the list

        $scope.products = ProductRest.query();

        $scope.productLog = function(){
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

appControllers.controller("postController", ['$scope', '$http', 'User', 'Users', 'ProductRest', 'AddProductRest', 'BuyRest', 'BasketStorage',
    function ($scope, $http, User, Users, ProductRest, AddProductRest, BuyRest, BasketStorage) {

        $scope.activeUser = {};
        $scope.productList = BasketStorage.getProducts();
        // calling our submit function.



        $scope.submitForm = function () {
            // geting existing user or creating new one.
            User.query($scope.activeUser);
        };

        $scope.buckedSumary = function () {
            var tempSum;
            $scope.productList.forEach(function (item) {
                tempSum += item.price;
            })
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
                BuyRest.buyQuery(currentBasket);
                $scope.basket.push(currentBasket);
            }
        };
    }]);

