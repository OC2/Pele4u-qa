angular.module('starter.controllers', ['ngCordova', 'ngStorage', 'ngCordova.plugins.nativeStorage'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats , $cordovaNativeStorage) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

  //----------------------------------------------------//
  //--           Local Storage
  //----------------------------------------------------//
  $scope.user = {};
  $scope.user.pin = "";

  $scope.set = function(){
    var myValue = $scope.user.pin;

    $cordovaNativeStorage.setItem("msisdn", myValue).then(
      // Success
      function (value) {
        console.log("Success : " + value);
          $cordovaNativeStorage.getItem("msisdn").then(function (value) {
            // Success 2
            console.log("Success 2 : " + value);
          }, function (error) {
            // Error 2
            console.log("Error 2 : " + error);
          });
    }, function (error) {
      // Error
        console.log("Error : " + error);
    });
  }; // set

  $scope.get = function(){
    $cordovaNativeStorage.getItem("msisdn").then(function (value) {
      // Success 2
      console.log("Success 2 : " + value);
      $scope.user.pin = value;
    }, function (error) {
      // Error 2
      console.log("Error 2 : " + error);
    });

  } // get

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
