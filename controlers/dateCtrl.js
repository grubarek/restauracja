appControllers.filter("myfilter", function () {
    return function (tekst) {
        var result = tekst.split("").reverse().join("");
        return result;
    };
});


appControllers.directive("yWidget", function() {
    return {
        template : "<h1>Hello Angular</h1>"
    };
});

appControllers.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

appControllers.controller("dateCtrl", function ($scope) {

    var currentDate = new Date();
    var days = ["Niedziela", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Poniedziałek"];
    $scope.dzien = "Dzisiaj jest: " + days[currentDate.getDay()];

    $scope.tekst = '';
    $scope.reversedTekst = '';
    $scope.reverseText = function () {
        $scope.reversedTekst = $scope.tekst.split("").reverse().join("");
    }
});
