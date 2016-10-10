/**
 * Created by User on 08/09/2016.
 */
var app = angular.module('pele.P1_appsListCtrl', ['ngStorage']);
//=====================================================================//
//==                         PAGE_1                                  ==//
//=====================================================================//
app.controller('P1_appsListCtrl'
              , function( $scope
                        , $http
                        , $state
                        , $ionicLoading
                        , PelApi
                        , $cordovaNetwork
                        , $rootScope
                        , $ionicPopup
                        , $ionicHistory
                        , $sessionStorage
                        , $localStorage
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
  //-----------------------------------------------------------
  //-- When        Who       Description
  //-- ----------  --------  -----------------------------------
  //-- 06/10/2016  R.W.
  //-----------------------------------------------------------
  $scope.setSettings = function(){
    var l_fileName = "/My Files &amp; Folders/" + appSettings.enviroment + "/PO/PO_" + appSettings.enviroment + "_220628/po_1768326_220628_4214854_110916161222.docx"
    p_fullFileName = "po_1768326_220628_4214854_110916161222.docx"
    var appId = config_app.appId;

    var lPath = PelApi.getfull_SETTINGS_DIRECTORY_NAME();
    var links = PelApi.getDocApproveServiceUrl("GetFileURI");
    var retGetFileURI = PelApi.GetFileURI(links, appId , config_app.Pin , l_fileName);

  }

  /*
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

          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');

          PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

          console.log("headers('msisdn_res') : " + headers('msisdn_res'));
          config_app.MSISDN_VALUE = headers('msisdn_res');
          $scope.setMSISDN(config_app.MSISDN_VALUE);

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
            $sessionStorage.user = config_app.GetUserMenu.user;
            $sessionStorage.userName = config_app.GetUserMenu.userName;

            config_app.Pin = config_app.GetUserMenu.PinCode;
            if(config_app.PIN_CODE_AUTHENTICATION_REQUIRED_CODE === config_app.Pin ){
              $state.go('app.login');
            }else{
              config_app.Pin = config_app.GetUserMenu.PinCode;
              config_app.IS_TOKEN_VALID = "Y";
            }

          } else if ("PAD" === pinCodeStatus ) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

            if(config_app.PIN_CODE_AUTHENTICATION_REQUIRED_CODE === config_app.Pin){
              $state.go('app.login');
            }

          }else if("PCR" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = appSettings.PIN_STATUS.PAD;
            //PelApi.showPopup(config_app.pinCodeSubTitlePCR , "");
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();
          }else if("PWA" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();
            //PelApi.showPopup(config_app.pinCodeSubTitlePWA , "");
          }else if("OLD" === pinCodeStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            errorMsg = appSettings.PIN_STATUS.PAD;
            PelApi.showPopupVersionUpdate(data.StatusDesc , "");
          }
        });
      }
      //--- ERROR ---//
      , function (response) {
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , JSON.stringify(response));
          console.log(config_app.LOG_FILE_ERROR_TYPE + " : " + JSON.stringify(response))
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
      }
    );
  } //  GetUserMenuMain
  $scope.setMSISDN = function(pin){

      var msisdn = window.localStorage.getItem("PELE4U_MSISDN");

      if(msisdn === undefined || msisdn === "" ){
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      }else if(msisdn !== pin){
        window.localStorage.removeItem("PELE4U_MSISDN");
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      }else{
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      }
    }; // setMSISDN
    $scope.getMSISDN = function(){
      var value = window.localStorage.getItem("PELE4U_MSISDN");
      return value;
    } // getMSISDN
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

    //-------------------------------//
    //PelApi.setPELE4_SETTINGS_DIRECTORY();
    //-------------------------------//
    var continueFlag = "Y";

    if("wifi" === config_app.network){
      config_app.MSISDN_VALUE = $scope.getMSISDN();

      if(config_app.MSISDN_VALUE === null){
        PelApi.showPopup(config_app.TITLE_WIFI_FIRST_CONNECTION_1 , config_app.TITLE_WIFI_FIRST_CONNECTION_2);
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      }else{
        if(config_app.IS_TOKEN_VALID !== "Y"){
            $scope.GetUserMenuMain();
        }else{
          $sessionStorage.token = config_app.token;
          $sessionStorage.user = config_app.GetUserMenu.user;
          $sessionStorage.userName = config_app.GetUserMenu.userName;
          $scope.feeds_categories = config_app.GetUserMenu;

          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    }else{
      config_app.IS_TOKEN_VALID= "Y"
      $scope.GetUserMenuMain();
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
      //window.location.href = path;
      $state.go(path, {"AppId": i.AppId, "Title": i.Title, "Pin": i.Pin});
    }

  };
  //-----------------------------------------------------------//
  //--                 forwardToApp
  //-----------------------------------------------------------//
  $scope.forwardToApp = function (statePath , appId , titleDisp) {

    $sessionStorage.PeleAppId = appId;

    srvShareData.addData({"PeleNetwork":config_app.network , "PeleMsisdnValue":config_app.MSISDN_VALUE ,"PeleAppId" : appId });

    var i = {};
    i.Path  = statePath;
    i.AppId = appId;
    i.Title = titleDisp;
    i.Pin   = config_app.Pin;

    $scope.appSwitch(i);

  };
  //-------------------------------//
  //--       Code Section        --//
  //-------------------------------//
  var btnClass={};
  btnClass.activ = false;
  $scope.class = "pele-menu-item-on-touch item-icon-right";
  $scope.doRefresh();
})
