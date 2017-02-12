
appControllers.controller("textReverseCtrl", function ($scope) {
    $scope.tekst = '';
    $scope.reversedTekst = '';
    $scope.reverseText = function () {
        $scope.reversedTekst = $scope.tekst.split("").reverse().join("");
    }
});