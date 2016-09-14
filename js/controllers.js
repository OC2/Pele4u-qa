angular.module('pele.controllers', ['ngStorage'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaNetwork , $rootScope , appSettings , $state ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    document.addEventListener("deviceready", function () {

      config_app.network = $cordovaNetwork.getNetwork();
      config_app.isOnline = $cordovaNetwork.isOnline();
      $scope.$apply();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        config_app.isOnline = true;
        config_app.network = $cordovaNetwork.getNetwork();
        $scope.$apply();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        config_app.isOnline = false;
        config_app.network = $cordovaNetwork.getNetwork();

        $scope.$apply();
      })

    }, false);

    if(appSettings.enviroment === "PD"){
      $scope.myClass = "envPD";
    }
    if(appSettings.enviroment === "QA"){
      $scope.myClass = "envQA";
      //$scope.myClass = "envPD";
    }
    if(appSettings.enviroment === "DV"){
      $scope.myClass = "envDV";
    }
    //===============================================//
    //== Forward to selected option from menu list ==//
    //===============================================//
    $scope.forwardTo = function(statePath){
      $state.go(statePath);
    }
    //===============================================
    //==             isShowLogOut
    //===============================================
    $scope.isShowLogOut = function(){
      var deviceInformation = ionic.Platform.device();
      var isWebView = ionic.Platform.isWebView();
      var isIPad = ionic.Platform.isIPad();
      var isIOS = ionic.Platform.isIOS();
      var isAndroid = ionic.Platform.isAndroid();
      var isWindowsPhone = ionic.Platform.isWindowsPhone();

      if(isAndroid){
      $scope.menu.isShowLogOut = true;
      }else{
        $scope.menu.isShowLogOut = false;
      }
    }
    //===============================================//
    //==            Log Out                        ==//
    //===============================================//
    $scope.logout  = function() {
      isAndroid = ionic.Platform.isAndroid();

      if(isAndroid){
        ionic.Platform.exitApp();
      }
    } ;
    $scope.menu ={};
    $scope.isShowLogOut();
})
//=====================================================================//
//==                        homeCtrl                                 ==//
//=====================================================================//
.controller('homeCtrl' , function($scope , $http , $state , $ionicLoading , PelApi , $cordovaNetwork , $rootScope , $ionicPopup, $stateParams){
    var showLoading = $stateParams.showLoading;
    if("Y" === showLoading){
      PelApi.showLoading();
    }
}) // homeCtrl
//=====================================================================//
//==                      Setings SendLog                            ==//
//=====================================================================//
.controller('SendLogCtrl' , function($scope){
}) // SendLogCtrl

//======================================================================
//==                          Settings
//======================================================================
.controller('SettingsListCtrl', [ '$scope'
                                , '$fileLogger'
                                , '$timeout'
                                , '$state'
                                , 'PelApi'
                                , function($scope
                                         , $fileLogger
                                         , $timeout
                                         , $state
                                         , PelApi
                                         ){

    $scope.sendMail = function(){

      $fileLogger.setStorageFilename(config_app.LOG_FILE_NAME);

      $fileLogger.info("==================== END ====================");

      $timeout(function(){

        $fileLogger.checkFile().then(function(d) {

          resolveLocalFileSystemURL(d.localURL.toString(), function(entry) {

            cordova.plugins.email.open({
              to:      'Mobile_Admins_HR@pelephone.co.il',
              subject: config_app.LOG_FILE_MAIL_SUBJECT,
              body:    '',
              attachments:  entry.toURL()
            });

            PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE ,'=============== Send Email ==============');

          }); // resolveLocalFileSystemURL
        });
      }, 8000);

    }; // sendMail

    //----------------------------------------------
    //--             forwardTo
    //----------------------------------------------
    $scope.forwardTo = function(statePath){
        $state.go(statePath);
    };
    //----------------------------------------------
    //--          Update Version
    //----------------------------------------------
    $scope.updateAppVersion = function(){
      var deviceInformation = ionic.Platform.device();
      var isWebView = ionic.Platform.isWebView();
      var isIPad = ionic.Platform.isIPad();
      var isIOS = ionic.Platform.isIOS();
      var isAndroid = ionic.Platform.isAndroid();
      var isWindowsPhone = ionic.Platform.isWindowsPhone();

      if(isAndroid){
        window.open(appSettings.GOOGLE_PLAY_APP_LINK, '_system', 'location=yes');
      }
      else if(isIOS){
        window.open(appSettings.APPLE_STORE_APP_LING, '_system', 'location=yes');
      }
    }// updateAppVersion

  }])
//========================================================================
//--                       AppProfileCtrl
//========================================================================
.controller('AppProfileCtrl', [ '$scope'
                                , '$fileLogger'
                                , '$timeout'
                                , 'PelApi'
                                , 'appSettings'
                                , function( $scope
                                          , $fileLogger
                                          , $timeout
                                          , PelApi
                                          , appSettings
                                ) {

      $scope.APP_VERSION = config_app.APP_VERSION;
      if("PD" !== appSettings.enviroment)
      {
        $scope.ENIRONMENT = " - " + appSettings.enviroment ;
      }else{
        $scope.ENIRONMENT = "";
      }

    }])

;
