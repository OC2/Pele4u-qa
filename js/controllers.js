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

//=====================================================================//
//==                      Setings SendLog                            ==//
//=====================================================================//



//=====================================================================//
//==                         PAGE_1                                  ==//
//=====================================================================//
.controller('P1_appsListCtrl', function($scope
                                      , $http
                                      , $state
                                      , $ionicLoading
                                      , PelApi
                                      , $cordovaNetwork
                                      , $rootScope
                                      , $ionicPopup
                                      , $ionicHistory
                                      , $sessionStorage
                                      , appSettings
                                      , $cordovaFile
                                      , srvShareData
                                      ) {

  $ionicHistory.clearHistory();
  //=======================================================//
  //== When        Who         Description               ==//
  //== ----------  ----------  ------------------------- ==//
  //== 27/12/2015  R.W.                                  ==//
  //=======================================================//
    $scope.pushBtnClass = function(event){

      console.log("pushBtnClass : " + event);

      if(event === true){
        return "pele-item-on-release";
      }else{
        return "pele-item-on-touch";
      }
    }// pushBtnClass

  $scope.onBtnAction = function(){
    btnClass.activ = !btnClass.activ;
  };
    /**
     * ==========================================================
     *                    GetUserMenuMain
     * ==========================================================
     */
  $scope.GetUserMenuMain = function(){
    var links = PelApi.getDocApproveServiceUrl("GetUserMenu");

    try{
      var reMenu = PelApi.getMenu(links);
    }catch(e){
      var isAndroid = ionic.Platform.isAndroid();

      if(isAndroid){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        window.location = "./index.html" ;
      }

    }

    reMenu.then(
      //--- SUCCESS ---//
      function () {

        reMenu.success(function (data, status, headers, config) {

          PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));
          console.log("========================================================");
          console.log(data);
          console.log("========================================================");

          var pinCodeStatus = PelApi.GetPinCodeStatus(data, "getMenu");
          if("Valid" === pinCodeStatus){

            config_app.token    = data.token;
            console.log("TOKEN : " + data.token);
            config_app.user     = data.user;
            config_app.userName = data.userName;
            var strData = JSON.stringify(data);
            strData = strData.replace(/\"\"/g,null);
            strData = strData.replace(/"\"/g,"");
            config_app.GetUserMenu = JSON.parse(strData);
            $scope.feeds_categories = config_app.GetUserMenu;

            //---------------------------------------------
            //-- Send User Tag for push notifications
            //---------------------------------------------
            if(window.plugins !== undefined){

              console.log("ENVIRONMENT : " + appSettings.enviroment);

              window.plugins.OneSignal.sendTags({"User": data.userName , "Env": appSettings.enviroment});

              window.plugins.OneSignal.getIds(function(ids) {
                  console.log(ids);
                }
              )
            }
            //--------------------------------------
            //  Save Important Data in session
            //--------------------------------------
            $sessionStorage.token = config_app.token;
            $sessionStorage.user = data.user;
            $sessionStorage.userName = data.userName;
            //$sessionStorage.AppId =

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

            //=================== END WRITE FILE ======================

          } else if ("PAD" === pinCodeStatus ) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.pinCodeSubTitlePDA , "");
          }else if("PCR" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopup(config_app.pinCodeSubTitlePCR , "");
          }else if("PWA" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopup(config_app.pinCodeSubTitlePWA , "");
          }else if("OLD" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopupVersionUpdate(data.StatusDesc , "");
          }
        });
      }
      //--- ERROR ---//
      , function () {
        reMenu.success(function (data, status, headers, config) {
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
        }).error(function (data, status, headers, config) {
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
        });
      }
    );
  } //  GetUserMenuMain

  /** *****************************************************************
   *  When         Who      Description
   *  -----------  -------  -------------------------------------------
   *  02/08/2016   R.W.
      *****************************************************************
  */
  $scope.doRefresh = function(){
    $scope.btn_class = {};
    $scope.btn_class.on_release = true;

    PelApi.showLoading();
    var errorMsg = "";

    $scope.isOnline = config_app.isOnline;
    $scope.network = config_app.network;

    var continueFlag = "Y";

    if("wifi" === config_app.network){

      if(config_app.MSISDN_VALUE===""){

          $cordovaFile.checkFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME)
            .then(function (success) {
              // success
              $cordovaFile.readAsText(cordova.file.dataDirectory , config_app.MSISDN_FILE_NAME )
                .then(function (success) {
                  // success

                  config_app.MSISDN_VALUE = success;
                  $scope.GetUserMenuMain();

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');


                }, function (error) {
                  // error

                  $scope.feeds_categories = {};
                  PelApi.showPopup(config_app.wifiTitle , config_app.MSISDN_READ_FILE_ERROR_DESC);

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');

              });

          }, function (error) {
            // error
          });

      }else{
        $scope.GetUserMenuMain();
      }
    }

    else{

    var links = PelApi.getDocApproveServiceUrl("GetUserMenu");

    try{
    var reMenu = PelApi.getMenu(links);
    }catch(e){
      var isAndroid = ionic.Platform.isAndroid();

      if(isAndroid){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        window.location = "./index.html" ;
      }

    }

    reMenu.then(
      //--- SUCCESS ---//
      function () {

        reMenu.success(function (data, status, headers, config) {

          PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

          config_app.MSISDN_VALUE = headers('msisdn_res');

          var pinCodeStatus = PelApi.GetPinCodeStatus(data, "getMenu");
          if("Valid" === pinCodeStatus){

            config_app.token    = data.token;
            console.log("TOKEN : " + data.token);
            config_app.user     = data.user;
            config_app.userName = data.userName;
            var strData = JSON.stringify(data);
            strData = strData.replace(/\"\"/g,null);
            strData = strData.replace(/"\"/g,"");
            config_app.GetUserMenu = JSON.parse(strData);
            $scope.feeds_categories = config_app.GetUserMenu;

            //---------------------------------------------
            //-- Send User Tag for push notifications
            //---------------------------------------------
            if(window.plugins !== undefined){

              console.log("ENVIRONMENT : " + appSettings.enviroment);

              window.plugins.OneSignal.sendTags({"User": data.userName , "Env": appSettings.enviroment});

              window.plugins.OneSignal.getIds(function(ids) {
                  console.log(ids);
                }
              )
            }
            //--------------------------------------
            //  Save Important Data in session
            //--------------------------------------
            $sessionStorage.token = config_app.token;
            $sessionStorage.user = data.user;
            $sessionStorage.userName = data.userName;
            //$sessionStorage.AppId =

            //=================== WRITE FILE ==========================
            var platform = ionic.Platform.platform();

            if("win32" !== platform ){
              $cordovaFile.checkFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME)
                .then(function (success) {
                  // success ( file exist )
                  $cordovaFile.removeFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME)
                    .then(function (success) {
                      // success ( remove file )
                      $cordovaFile.createFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME, true)
                        .then(function (success) {
                          // success ( create file )
                          $cordovaFile.writeFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME, config_app.MSISDN_VALUE, true)
                            .then(function (success) {
                              // success
                              console.log("$cordovaFile.writeFile : SUCCESS");
                              console.log(success);

                              $ionicLoading.hide();
                              $scope.$broadcast('scroll.refreshComplete');

                            }, function (error) {
                              // error
                              console.log("$cordovaFile.writeFile : ERROR");
                              console.log(error);

                              $ionicLoading.hide();
                              $scope.$broadcast('scroll.refreshComplete');

                            });
                        }, function (error) {
                          // error
                          console.log("ERROR createFile : " + error );
                        });
                    }, function (error) {
                      // error
                      console.log("ERROR removeFile : " + error );
                    });
              }, function (error) {
                  // error
                  $cordovaFile.createFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME, true)
                    .then(function (success) {
                      // success ( create file )
                      $cordovaFile.writeFile(cordova.file.dataDirectory, config_app.MSISDN_FILE_NAME, data.user, true)
                        .then(function (success) {
                          // success
                          console.log("$cordovaFile.writeFile : SUCCESS");
                          console.log(success);

                          $ionicLoading.hide();
                          $scope.$broadcast('scroll.refreshComplete');

                        }, function (error) {
                          // error
                          console.log("$cordovaFile.writeFile : ERROR");
                          console.log(error);

                          $ionicLoading.hide();
                          $scope.$broadcast('scroll.refreshComplete');

                        });
                    }, function (error) {
                      // error
                      console.log("ERROR createFile : " + error );
                  });
              });

            }else{

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');

            }
            //=================== END WRITE FILE ======================

          } else if ("PAD" === pinCodeStatus ) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.pinCodeSubTitlePDA , "");
          }else if("PCR" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopup(config_app.pinCodeSubTitlePCR , "");
          }else if("PWA" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopup(config_app.pinCodeSubTitlePWA , "");
          }else if("OLD" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = config_app.PIN_STATUS.PAD;
            PelApi.showPopupVersionUpdate(data.StatusDesc , "");
          }
        });
      }
      //--- ERROR ---//
      , function () {
        reMenu.success(function (data, status, headers, config) {
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
        }).error(function (data, status, headers, config) {
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
        });
      }
    );
    }

  }
  //------------------------------------------------------
  //--                  Switch APP
  //------------------------------------------------------
  $scope.appSwitch  = function(i) {

      var iabOptions = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };

      var target = i.target || "_blank";
      if(i.url) {
        $cordovaInAppBrowser.open(i.url, target,iabOptions)
          .then(function(event) {
            // success
          }, function(event) {
            // error
          });
        return false;
      } else if(i.Path) {
        var path = i.Path; //"apps/" + i.Path + "/app.html";
        window.location.href = path;
      }

    };
  //-----------------------------------------------------------//
  //--                 forwardToApp
  //-----------------------------------------------------------//
  $scope.forwardToApp = function (statePath , appId , titleDisp) {

      $sessionStorage.PeleAppId = appId;

      srvShareData.addData({"PeleNetwork":config_app.network , "PeleMsisdnValue":config_app.MSISDN_VALUE ,"PeleAppId" : appId });

      var i = {};
        // i.Path = statePath;
      i.Path = "apps/DocApprove/app.html"; // Replace after modefication in SSO
      $scope.appSwitch(i);
      /*
      }
      */

    };
  //-------------------------------//
  //--       Code Section        --//
  //-------------------------------//
  var btnClass={};
  btnClass.activ = false;
  $scope.class = "pele-menu-item-on-touch item-icon-right";
  $scope.doRefresh();
})
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
        window.open(config_app.GOOGLE_PLAY_APP_LINK, '_system', 'location=yes');
      }
      else if(isIOS){
        window.open(config_app.APPLE_STORE_APP_LING, '_system', 'location=yes');
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
