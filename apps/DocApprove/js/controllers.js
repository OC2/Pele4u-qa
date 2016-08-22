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

    if(appSettings.enviroment === "PROD"){
      $scope.myClass = "envPD";
    }
    if(appSettings.enviroment === "QA"){
      $scope.myClass = "envQA";
      //$scope.myClass = "envPD";
    }
    if(appSettings.enviroment === "DEV"){
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
      }
      else{
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


//=================================================================
//==                    PAGE_2
//=================================================================
  .controller('P2_moduleListCtrl', function($scope,
                                            $http,
                                            $stateParams ,
                                            $state ,
                                            PelApi,
                                            $cordovaNetwork,
                                            $ionicLoading,
                                            $ionicModal ,
                                            $timeout ,
                                            $sessionStorage,
                                            appSettings
                                            ,srvShareData
                                            ) {
    //----------------------- LOGIN --------------------------//

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/apps/docApprove/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    //-----------------------------------------------
    //--    Is show BTN
    //-----------------------------------------------
    $scope.isShowBtn = function(qty){
      var retVal = true;
      if(qty === "-1"){
        return "ng-hide";
      }
      else{
        return "ng-show";
      }

      return retVal;

    }
    $scope.pushBtnClass = function(event){

      console.log("pushBtnClass : " + event);

      if(event === true){
        return "pele-item-on-release";
      }else{
        return "pele-item-on-touch";
      }
    }// pushBtnClass
    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    //---------------------------------
    //--       goHome
    //---------------------------------
    $scope.goHome = function(){
      PelApi.goHome();
    }

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {

      //var appId = $sessionStorage.AppId;
      var appId = config_app.appId;
      var pin = 0;//$scope.loginData.pin;
      var titleDisp = $sessionStorage.title;
      $state.go("app.p2_moduleList",{AppId : appId , title:titleDisp ,"pin":pin});
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
    //======= onClick ========//
    $scope.onClick = function (formType, docQty) {
      if(0 < docQty){

        /*
        if("wifi" === config_app.network){
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        }else{
        */
          //var appId = $stateParams.AppId;
          var path = "";
          if( "HR" === formType ){
            path = appSettings.MODULE_TYPES_FORWARD_PATH.HR;
          }else if( "POAPPRV" === formType){
            path = appSettings.MODULE_TYPES_FORWARD_PATH.POAPPRV;
          }

          appId = config_app.appId;
          $state.go(path , {AppId: appId, FormType: formType, pin:"0"});
        /*
        }
        */
      }
    };

    //===========================================================//
    //== When        Who      Description                      ==//
    //== ----------  -------  ---------------------------------==//
    //== 23/02/2016  R.W.                                      ==//
    //===========================================================//
    $scope.ontouch = function(pushFlag){
      pushFlag = !pushFlag;
    };

    //===========================================================//
    //== When        Who      Description                      ==//
    //== ----------  -------  ---------------------------------==//
    //== 23/02/2016  R.W.                                      ==//
    //===========================================================//
    $scope.insertOnTouchFlag = function(arr){
      var myArr = [];
      for(var i=0; i< arr.length; i++){

        var myObj = {
          DOCUMENT_QTY: arr[i].DOCUMENT_QTY,
          MODULE_DESC: arr[i].MODULE_DESC,
          MODULE_NAME: arr[i].MODULE_NAME,
          PUSH_FLAG:true
        };

        myArr.push(myObj);

      }// for;
      return myArr;
    }// insertOnTouchFlag

    //===================== Refresh ===========================//
    $scope.doRefresh = function(){
      //--

      console.log("------------------------------------");
      console.log(      srvShareData.getData()          );
      console.log("------------------------------------");
      $scope.menuPageData = srvShareData.getData();
      $scope.btn_class = {};
      $scope.btn_class.on_release = true;

      PelApi.showLoading();

      //var appId = $stateParams.AppId;
      //var pin = $stateParams.pin;

      $sessionStorage.DOC_ID = "";
      var pin = 0;//$scope.loginData.pin;

      console.log("appId : " + appId);

      var titleDisp = $sessionStorage.title;
      // var appId = config_app.appId;

      var appId               = $scope.menuPageData[0].PeleAppId
      config_app.appId        = appId;
      config_app.token        = $sessionStorage.token;
      config_app.userName     = $sessionStorage.userName;
      if(config_app.network === "" || config_app.network === undefined){
        config_app.network = $scope.menuPageData[0].PeleNetwork;
      }
      if(config_app.MSISDN_VALUE === "" || config_app.MSISDN_VALUE === undefined){
        config_app.MSISDN_VALUE = $scope.menuPageData[0].PeleMsisdnValue;
      }

      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
      }
      else {
      */
        var links = PelApi.getDocApproveServiceUrl("GetUserModuleTypes");

        var retUserModuleTypes = PelApi.getUserModuleTypes(links, appId, pin);

        retUserModuleTypes.then(
          //--- SUCCESS ---//
          function () {
            retUserModuleTypes.success(function (data, status, headers, config) {

              $scope.feeds_categories = [];

              PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE, JSON.stringify(data));

              var stat = PelApi.GetPinCodeStatus(data, "getUserModuleTypes");
              var pinCodeStatus = stat.status;

              if ("Valid" === pinCodeStatus) {
                config_app.GetUserModuleTypes = data;

                if (config_app.GetUserModuleTypes.Response.OutParams !== null) {

                  var category_sources = $scope.insertOnTouchFlag(config_app.GetUserModuleTypes.Response.OutParams.MOBILE_MODULE_REC);

                  $scope.category_sources_length = config_app.GetUserModuleTypes.Response.OutParams.MOBILE_MODULE_REC.length;

                  $scope.category_sources = category_sources; //config_app.GetUserModuleTypes.Response.OutParams.MOBILE_MODULE_REC;
                }

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

              } else if ("PWA" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                var errordesc = config_app.PIN_STATUS.PWA;
                //var appId = $stateParams.AppId;
                var appId = config_app.appId;
                var titleDisp = $stateParams.title;
                var pincode = PelApi.showPinCode(appId, titleDisp, config_app.pinCodeSubTitlePWA);

              } else if ("PCR" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.loginData.error = config_app.PIN_STATUS.PAD;
                var appId = config_app.appId;
                var titleDisp = $stateParams.title;
                // Create the login modal that we will use later
                var pincode = PelApi.showPinCode(appId, titleDisp, config_app.pinCodeSubTitlePCR);
                //$scope.login();

              } else if ("PAD" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.pinCodeSubTitlePDA, "");

              } else if ("PNE" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.pinCodeSubTitlePNE, "");

              } else if ("NRP" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.pinCodeSubTitleNRP, "");

              } else if ("InValid" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                //$state.go("app.p1_appsLists");
                //PelApi.goHome();

              } else if ("EAI_ERROR" === pinCodeStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

              } else if("EOL" === pinCodeStatus){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.goHome();

              } else if ("ERROR_CODE" === pinCodeStatus){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(stat.description, "");
              }

            });
          }
          //--- ERROR ---//
          , function () {
            retUserModuleTypes.success(function (data, status, headers, config) {

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
      /*
      }
      */
    }; // doRefresh
    //======= dats section ====//
    $scope.category_sources = [];
    $scope.btn_class = {};
    $scope.btn_class.on_release = true
    $scope.doRefresh();

  })
//=================================================================
//==                    PAGE_3
//=================================================================
  .controller('p3_moduleDocListCtrl', function($scope, $stateParams, $http, $q, $ionicLoading, $state ,PelApi , $cordovaNetwork , $sessionStorage) {

    //---------------------------------
    //--       goHome
    //---------------------------------
    $scope.goHome = function(){
      PelApi.goHome();
    }
    //----------------------- REFRESH ------------------------//
    $scope.doRefresh = function() {

      PelApi.showLoading();

      var sessionDocId = $sessionStorage.DOC_ID;
      $scope.toggleGroup(sessionDocId);

      //var appId = $stateParams.AppId,
      var appId = config_app.appId,
        formType = $stateParams.FormType,
        pin = $stateParams.pin;
      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
      }
      else {
      */
        var links = PelApi.getDocApproveServiceUrl("GtUserFormGroups");

        var retGetUserFormGroups = PelApi.GetUserFormGroups(links, appId, formType, pin);

        retGetUserFormGroups.then(
          //--- SUCCESS ---//
          function () {

            retGetUserFormGroups.success(function (data, status, headers, config) {

              PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));



              var stat = PelApi.GetPinCodeStatus(data, "GetUserFormGroups");
              var pinStatus = stat.status;

              if ("Valid" === pinStatus) {

                if(data.Response.OutParams.ROW[0].DOC_NAME === null)
                {
                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  //$state.go("app.p1_appsLists");
                  PelApi.goHome();
                }else{
                  $scope.chats = data.Response.OutParams.ROW;
                  console.log($scope.chats);
                  $scope.title = "";
                  var rowLength = $scope.chats.length;
                  if(rowLength > 0){
                    $scope.title = $scope.chats[0].DOC_TYPE;
                  }
                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                }
              } else if ("PDA" === pinStatus) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.login();

              } else if ("InValid" === pinStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                //$state.go("app.p1_appsLists");
                PelApi.goHome();

              } else if ("EAI_ERROR" === pinStatus){

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

              } else if("EOL" === pinCodeStatus){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.goHome();
              } else if ("ERROR_CODE" === pinStatus){

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(stat.description, "");

              }
            }).error(function (data, status, headers, config) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
              });
          }
          //--- ERROR ---//
          , function () {
            retGetUserFormGroups.success(function (data, status, headers, config) {

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
      /*
      }
      */
    };
    //---------------------------------------------------------
    //-- When        Who       Description
    //-- ==========	 ========  ================================
    //-- 20/10/2015  R.W.      Accordion functions
    //---------------------------------------------------------
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };
    //----------------------------------------------------------
    //-- Search bar JSON rebild
    //----------------------------------------------------------
    $scope.searchBarCreteria = function(){
      var searchText = $scope.searchText.text;
      if($scope.searchText.text !== undefined && $scope.searchText.text !== "")
      {
        list = $scope.chats;
        for(var i=0 ; i< list.length ; i++){
          var sCount = 0;
          for(var j=0 ; j< list[i].DOCUMENTS.DOCUMENTS_ROW.length ; j++ ){
            var owner = list[i].DOCUMENTS.DOCUMENTS_ROW[j].MESSAGE;
            var n = owner.indexOf(searchText);
            if(-1 !== n){
              sCount ++;
            }
          }
          $scope.chats[i].FORM_QTY = sCount;
        }
      }
      else{
        for(var i=0 ; i< list.length ; i++){
          var sCount = list[i].DOCUMENTS.DOCUMENTS_ROW.length;
          $scope.chats[i].FORM_QTY = sCount;
        }
      }
    };//
    //--------------------------------------------------------------
    //-- When        Who         Description
    //-- ----------  ----------  -----------------------------------
    //-- 01/11/2015  R.W.        function forward to page by DOC_ID
    //--------------------------------------------------------------
    $scope.forwardToDoc = function(docId , docInitId){
      //var appId = $stateParams.AppId;
      var appId = config_app.appId;
      var statePath = 'app.doc_' + docId;
      /*
      if("wifi" === config_app.network){
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
      }else {
      */
        PelApi.showLoading();

        var links = PelApi.getDocApproveServiceUrl("GetUserNotif");

        var retGetUserNotifications = PelApi.GetUserNotifications(links, appId, docId, docInitId);
        retGetUserNotifications.then(
          //--- SUCCESS ---//
          function () {
            retGetUserNotifications.success(function (data, status, headers, config) {
              console.log("============= Get User Notification ===============");
              console.log(JSON.stringify(data));
              console.log("============= End Get User Notification ===============");

              var stat = PelApi.GetPinCodeStatus(data, "GetUserNotifications");
              var pinStatus = stat.status;

              if ("Valid" === pinStatus) {

                PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

                var strData = JSON.stringify(data);
                strData = strData.replace(/\\/g, "");
                strData = strData.replace(/"{/g, "{");
                strData = strData.replace(/}"/g, "}");
                console.log("======================================");
                console.log(strData);
                console.log("======================================");

                var newData = JSON.parse(strData);
                config_app.docDetails = newData.Response.OutParams.Result.ROWSET.ROW;

                var buttonsLength = config_app.docDetails.BUTTONS.length;
                // Show the action sheet
                if(2 === buttonsLength) {
                  config_app.ApprovRejectBtnDisplay = true;
                }else{
                  config_app.ApprovRejectBtnDisplay = false;
                }

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                $state.go(statePath, {"AppId": appId, "DocId": docId, "DocInitId": docInitId});

              } else if ("PDA" === pinStatus) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.login();

              } else if ("InValid" === pinStatus) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                //$state.go("app.p1_appsLists");
                PelApi.goHome();

              } else if("EOL" === pinStatus){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.goHome();

              } else if ("EAI_ERROR" === pinStatus){

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

              } else if ("ERROR_CODE" === pinStatus){

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(stat.description, "");

              }
            }).error(function (data, status, headers, config) {

                PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success.error : " + JSON.stringify(data));

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.getUserModuleTypesErrorMag , "");
            });

          }
          //--- ERROR ---//
          , function () {

            retGetUserNotifications.success(function (data, status, headers, config) {

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
      /*
      }
      */
    } // forwardToDoc

    $scope.feed = [];
    $scope.searchText = {};
    $scope.doRefresh();

  })
//=================================================================
//==                    PAGE_4
//=================================================================
  .controller('DocCtrl',['$rootScope'
                        ,'$scope'
                        ,'$stateParams'
                        ,'$http'
                        ,'$q'
                        ,'$location'
                        ,'$window'
                        ,'$timeout'
                        ,'$ionicLoading'
                        ,'$ionicActionSheet'
                        ,'$ionicModal'
                        ,'PelApi'
                        ,'$ionicNavBarDelegate'
                        ,'$cordovaNetwork'
                        ,'$ionicPopup'
                        ,'appSettings'
                        ,'$sessionStorage'
    , function(  $rootScope
    , $scope
    , $stateParams
    , $http
    , $q
    , $location
    , $window
    , $timeout
    , $ionicLoading
    , $ionicActionSheet
    , $ionicModal
    , PelApi
    , $ionicNavBarDelegate
    , $cordovaNetwork
    , $ionicPopup
    , appSettings
    , $sessionStorage
  ) {
    //---------------------------------
    //--       goHome
    //---------------------------------
    $scope.goHome = function(){
       PelApi.goHome();
    }
    //---------------------------------------------------------------------------
    //--                         openExistText
    //---------------------------------------------------------------------------
    $scope.openExistText = function(text){
      $scope.data = {};
      $scope.data.docText1 = text;
      if(text!== null){
        var myPopup = $ionicPopup.show({
          template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" readonly="true" ng-model="data.docText1" type="text" >{{data.docText1}}</textarea></label></div>',
          title: '<a class="float-right"></a>',
          subTitle: '',
          scope: $scope,
          buttons: [
            {
              text: '<a class="pele-popup-positive-text-collot">סגור</a>',
              type: 'button-positive',
              onTap: function (e) {
              }
            },
          ]
        });
        myPopup.then(function(res) {

        });
      }
    } // openExistText
    //---------------------------------------------------------------------------
    //--                         isGroupShown
    //---------------------------------------------------------------------------
    $scope.isGroupShown = function(group){
      return $scope.shownGroup === group;
    } // isGroupShown
    //---------------------------------------------------------------------------
    //--                         isGroupShown
    //---------------------------------------------------------------------------
    $scope.isHourException12Shown = function(exception_note){
        var retVal = true;

        if(exception_note === undefined || exception_note === " "){
          retVal = false;
        }

        return retVal;
    } // isGroupShown
    //---------------------------------------------------------------------------
    //--                         getApproveListActionIcon
    //---------------------------------------------------------------------------

    $scope.getApproveListActionIcon=function(action , date , note) {

      var icon_class;
      if (appSettings.ACTION_HISTORY.FORWARD === action) {
        icon_class = "ion-checkmark-circled";
      } else if (appSettings.ACTION_HISTORY.NO_ACTION === action) {
        icon_class = "ion-minus-circled";
      } else if (appSettings.ACTION_HISTORY.REJECT === action) {
        icon_class = "ion-close-circled";
      } else if(appSettings.ACTION_HISTORY.WAITING === action){
        //icon_class = "ion-pause";
        icon_class = "";
      }else{
        icon_class = "";
      }

      return icon_class;


    } // getApproveListActionIcon
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.showIconCollapseInAcctionHistory = function(showFlag , hidenFlag){
      var retVal = "";
      if(hidenFlag === true){
        retVal = "";
      }else if(showFlag === true){
        retVal = "icon-collapse";
      }else if(showFlag === false){
        retVal = "icon-expand";
      }

      return retVal;

    }
    //---------------------------------------------------------------------------
    //--                         isGroupShown
    //---------------------------------------------------------------------------
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
    };
    //----------------------------------------------------------------------------
    //----------------------------------------------------------------------------
    $scope.addPushFlagToActionHistory = function(arr){
      var myArr = [];
      var j = arr.length;
      for(var i = 0; i < arr.length ; i++ , j--){
        var showFlag = false;
        var hideFlag = false
        if(arr[i].NOTE !== "" && arr[i].NOTE != undefined){
          showFlag = false;
        }else{
          showFlag = true;
        };

        var l_displayFlag = arr[j-1].DISPLAY_FLAG;
        var l_actionCode = arr[j-1].ACTION_CODE;
        if((arr[i].ACTION === "" || arr[i].ACTION === undefined || arr[i].ACTION === null)
          && (arr[i].ACTION_DATE === "" || arr[i].ACTION_DATE === undefined || arr[i].ACTION_DATE === null)){
          hideFlag = true
        }


        var mayObj = {
          "DISPLAY_FLAG":arr[i].DISPLAY_FLAG,
          "DOC_INIT_ID":arr[i].DOC_INIT_ID,
          "APPROVAL_SEQ":arr[i].APPROVAL_SEQ,
          "CREATION_DATE":arr[i].CREATION_DATE,
          "USER_NAME":arr[i].USER_NAME,
          "ACTION":arr[i].ACTION,
          "ACTION_DATE":arr[i].ACTION_DATE,
          "NOTE":arr[i].NOTE,
          "SEQUENCE_NUM":i+1,
          "SHOW_FLAG": showFlag,
          "HIDEN_FLAG": hideFlag,
          "PUSH_COUNT": 0
        }

        myArr.push(mayObj);

      }// for

      return myArr;
    }// addPushFlagToActionHistory
    //----------------------------------------------------------------
    //-- When         Who       Description
    //-- ===========  ========  ======================================
    //-- 17/03/2016   R.W.
    //----------------------------------------------------------------
    $scope.hidenAcctionHistoryDetails = function(showFlag , hidenFlag , pushCount , note ){
      var retVal = "";
      if(hidenFlag === true){
        retVal = true;
      }else if(showFlag === true){
        if(pushCount === 0 ){
          if(note !== "" && note !== undefined && note !== null){
            retVal = false;
          }else{
            retVal = true;
          }
        }else{
          retVal = true;
        }

      }else if(showFlag === false){
        retVal = false;
      }
      return retVal;

    }
    //---------------------------------------------------------------------------
    //--                         doRefresh
    //---------------------------------------------------------------------------
    $scope.doRefresh = function() {
      $scope.data = {};
      $scope.feed = [];
      $scope.tabs = config_app.tabs;

      var buttons = {};
      //buttons.approve = true;


      $scope.style = {
        color: 'red'
      };

      //var appId = $stateParams.AppId,
      var appId = config_app.appId,
        docId = $stateParams.DocId,
        docInitId = $stateParams.DocInitId;

      $sessionStorage.DOC_ID = docId;
      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }
      else {
      */
        console.log(config_app.docDetails);
        if(config_app.docDetails.DOC_LINES.length > 1){
          $scope.shownGroup = null;
        }else{
          if(docId === "807"){
            $scope.shownGroup = config_app.docDetails.DOC_LINES[0].ATTRIBUTE2;
          }
          else{
          $scope.shownGroup = config_app.docDetails.DOC_LINES[0].EFFECTIVE_DATE;
          }
        }
        $scope.buttonsArr      = config_app.docDetails.BUTTONS;
        $scope.docDetails      = config_app.docDetails;
        $scope.sourceTitle     = config_app.docDetails.DOC_NAME;
        $scope.CREATOR         = config_app.docDetails.CREATOR;
        $scope.EMP_NUMBER      = config_app.docDetails.EMP_NUMBER;
        $scope.SECTOR          = config_app.docDetails.SECTOR;
        $scope.DEPARTMENT      = config_app.docDetails.DEPARTMENT;
        $scope.DOC_INIT_ID     = config_app.docDetails.DOC_INIT_ID;
        $scope.SENT_DATE       = config_app.docDetails.SENT_DATE;
        $scope.NOTIFICATION_ID = config_app.docDetails.NOTIFICATION_ID;
        $scope.HOLIDAY_BALANCE = config_app.docDetails.HOLIDAY_BALANCE;

        console.log("========================  ACTION_HISTORY SOURCE  ====================================")
        console.log(JSON.stringify(config_app.docDetails.ACTION_HISTORY));
        console.log("=============================================================================")

        $scope.ACTION_HISTORY  = $scope.addPushFlagToActionHistory(config_app.docDetails.ACTION_HISTORY);

        console.log("========================  ACTION_HISTORY ====================================")
        console.log(JSON.stringify($scope.ACTION_HISTORY));
        console.log("=============================================================================")

        // Show the action sheet
        $scope.approve = config_app.ApprovRejectBtnDisplay;

        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      /*
      }
      */
    }; // doRefresh

    $scope.redStyle = function(flag){
      var retVal;
      if("Y" ===  flag){
        $scope.style.color = "red";
      }else if("N" === flag){
        $scope.style.color = "black";
      }
      return $scope.style;
    };
    //---------------------------------------------------------------------
    //-- When           Who             Description
    //-- -------------	--------------  -----------------------------------
    //-- 13/10/2015     R.W.            Hide / Show Approval List Rows
    //---------------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.createNote = function(u) {
      $scope.Note = u.Note;
      $scope.modal.hide();
    };
    //---------------------------------------------------------------------
    //-- When           Who             Description
    //-- -------------	--------------  -----------------------------------
    //-- 13/10/2015     R.W.            Hide / Show Approval List Rows
    //---------------------------------------------------------------------
    $scope.pelHideShow = function(action , note){
      var retStatus;
      if(action != "" && action != undefined)
      {
        retStatus = false;
      }else {
        retStatus = true;
      }

      if(retStatus && note != "" && note != undefined ) {
        retStatus = false;
      }
      return retStatus;
    };

    $scope.onSlideMove = function(data){
      //alert("You have selected " + data.index + " tab");
    };
    //-----------------------------------
    //--         Btn Action
    //-----------------------------------
    $scope.docApprove = function(){

      //PelApi.showLoading();

      //var appId = $stateParams.AppId;
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'APPROVE';
      var note = '';
      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }else {
      */
        //===================================================//
        //==        Add Note Yes/No popup
        //===================================================//
        var myYesNoPopup = $ionicPopup.show({
          title: config_app.isAddNoteTitle,
          subTitle: '',
          scope: $scope,
          buttons: [
            {
              text: '<a class="pele-popup-positive-text-collot">כן</a>',
              type: 'button-positive',
              onTap: function (e) {
                return true;
              }
            },
            {
              text: '<a class="pele-popup-positive-text-collot">לא</a>',
              type: 'button-assertive',
              onTap: function (e) {

                return false;
              }
            },
          ]
        });
        myYesNoPopup.then(function (res) {
          if(res){
            //===============================================//
            //==                 Get Note                  ==//
            //===============================================//
            $scope.data = {};
            var myPopup = $ionicPopup.show({
              template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text"></textarea></label></div>',
              title: '<a class="float-right">הערות</a>',
              subTitle: '',
              scope: $scope,
              buttons: [
                {
                  text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
                  type: 'button-positive',
                  onTap: function (e) {
                    if (!$scope.data.note) {
                      //don't allow the user to close unless he enters wifi password
                      e.preventDefault();
                      PelApi.showPopup("יש להזין הערה", "");
                    } else {
                      $scope.data.cancel = false;
                      return $scope.data;
                    }
                  }
                },
                {text: 'ביטול',
                  type: 'button-assertive',
                  onTap: function (e) {
                    $scope.data.note = "";
                    $scope.data.cancel = true;
                    return $scope.data;
                  }
                },
              ]
            });
            myPopup.then(function (res) {
              if(!res.cancel) {
                PelApi.showLoading();
                note = res.note;
                var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
                var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
                retSubmitNotification.then(
                  //---- SUCCESS -----//
                  function () {
                    retSubmitNotification.success(function (data, status, headers, config) {

                      var stat = PelApi.GetPinCodeStatus(data, "GetUserNotif");
                      var pinStatus = stat.status;

                      if("EOL" === pinStatus ){
                        $scope.goHome();
                      } else if ("EAI_ERROR" === pinStatus){

                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

                      } else if ("ERROR_CODE" === pinStatus){

                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        PelApi.showPopup(stat.description, "");

                      }else{
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicNavBarDelegate.back();
                      }

                      PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');
                      $ionicNavBarDelegate.back();
                    }),
                      retSubmitNotification.error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicNavBarDelegate.back();
                      });
                  },
                  //---- ERROR -----//
                  function () {
                    retSubmitNotification.success(function (data, status, headers, config) {

                      PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));

                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');
                      $ionicNavBarDelegate.back();
                    }),
                      retSubmitNotification.error(function (data, status, headers, config) {

                        PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));

                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $ionicNavBarDelegate.back();

                      })
                  }
                );
              }
            });
          }else{
            PelApi.showLoading();
            var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
            var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
            retSubmitNotification.then(
              //---- SUCCESS -----//
              function () {
                retSubmitNotification.success(function (data, status, headers, config) {

                  var stat = PelApi.GetPinCodeStatus(data, "SubmitNotif");
                  var pinStatus = stat.status;

                  if("EOL" === pinStatus ){
                    $scope.goHome();
                  } else if ("EAI_ERROR" === pinStatus){

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

                  } else if ("ERROR_CODE" === pinStatus){

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    PelApi.showPopup(stat.description, "");

                  }else{
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();
                  }

                  PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  $ionicNavBarDelegate.back();
                }),
                  retSubmitNotification.error(function (data, status, headers, config) {

                    PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success.error : " + JSON.stringify(data));

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();
                  });
              },
              //---- ERROR -----//
              function () {
                retSubmitNotification.success(function (data, status, headers, config) {

                  PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  $ionicNavBarDelegate.back();
                }),
                  retSubmitNotification.error(function (data, status, headers, config) {

                    PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();

                  })
              }
            );
          };
        });
      /*
      }
      */
    };
    //-----------------------------------
    //--         OK
    //-----------------------------------
    $scope.docOK = function(){

      //PelApi.showLoading();

      //var appId = $stateParams.AppId;
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'OK';
      var note = '';
      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }
      else {
      */
            PelApi.showLoading();
            var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
            var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
            retSubmitNotification.then(
              //---- SUCCESS -----//
              function () {
                retSubmitNotification.success(function (data, status, headers, config) {

                  PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

                  var stat = PelApi.GetPinCodeStatus(data, "SubmitNotif");
                  var pinStatus = stat.status;

                  if("EOL" === pinStatus ){
                    $scope.goHome();
                  } else if ("EAI_ERROR" === pinStatus){

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

                  } else if ("ERROR_CODE" === pinStatus){

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    PelApi.showPopup(stat.description, "");

                  }else{
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();
                  }

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  $ionicNavBarDelegate.back();
                }),
                  retSubmitNotification.error(function (data, status, headers, config) {

                    PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success.error" + JSON.stringify(data));

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();
                  });
              },
              //---- ERROR -----//
              function () {
                retSubmitNotification.success(function (data, status, headers, config) {

                  PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  $ionicNavBarDelegate.back();
                }),
                  retSubmitNotification.error(function (data, status, headers, config) {

                    PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));

                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicNavBarDelegate.back();

                  })
              }
            );
        /*
        } // else WIFI
        */
    };
    //----------------------------------------
    //--         REJECT                     --
    //----------------------------------------
    $scope.docReject = function(){
      //var appId = $stateParams.AppId;
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = "REJECT";
      /*
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }else {
      */
        if($scope.data.note !== undefined){
          $scope.submitNotif(actionType , $scope.data.note)
        }else {
          var myPopup = $ionicPopup.show({
            template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text">{{data.note}}</textarea></label></div>',
            title: '<a class="float-right">הערות</a>',
            subTitle: '',
            scope: $scope,
            buttons: [
              {

                text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
                type: 'button-positive',
                onTap: function (e) {
                  if (!$scope.data.note) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                    PelApi.showPopup("יש להזין הערה", "");
                  } else {

                    return $scope.data.note;
                  }
                }
              },
              {
                text: 'ביטול',
                type: 'button-assertive'
              },
            ]
          });
          myPopup.then(function (res) {
            note = res
            if (note !== undefined) {
              $scope.submitNotif(actionType, note);
            }
          });
        }
      /*
      }
      */
    }; // docReject
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    $scope.submitNotif = function(action , note){
      //var appId = $stateParams.AppId;
      var appId = config_app.appId;

      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = action;

      PelApi.showLoading();
      var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
      var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
      retSubmitNotification.then(
        //---- SUCCESS -----//
        function () {
          retSubmitNotification.success(function (data, status, headers, config) {

            PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

            var stat = PelApi.GetPinCodeStatus(data, "SubmitNotif");
            var pinStatus = stat.status;
            if("EOL" === pinStatus ){
              $scope.goHome();
            } else if ("EAI_ERROR" === pinStatus){

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

            } else if ("ERROR_CODE" === pinStatus){

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.showPopup(stat.description, "");

            }else{
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              $ionicNavBarDelegate.back();
            }

          }),
            retSubmitNotification.error(function (data, status, headers, config) {

              PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success.error : " + JSON.stringify(data));

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              $ionicNavBarDelegate.back();
            });
        },
        //---- ERROR -----//
        function () {
          retSubmitNotification.success(function (data, status, headers, config) {

            PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "success : " + JSON.stringify(data));

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $ionicNavBarDelegate.back();
          }),
            retSubmitNotification.error(function (data, status, headers, config) {

              PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE , "error : " + JSON.stringify(data));

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              $ionicNavBarDelegate.back();

            })
        }
      );
    } ;
    //--------------------------------------------------------------
    //-- When         Who       Description
    //-- -----------  --------  ------------------------------------
    //-- 06/01/2016   R.W.
    //--------------------------------------------------------------
    $scope.NotePopup = function(){
      var myPopup = $ionicPopup.show({
        template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text">{{data.note}}</textarea></label></div>',
        title: '<a class="float-right">הערות</a>',
        subTitle: '',
        scope: $scope,
        buttons: [
          {

            text: '<a class="pele-popup-positive-text-collot">המשך</a>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.note) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                PelApi.showPopup("יש להזין הערה", "");
              } else {

                return $scope.data.note;
              }
            }
          },
          {text: 'ביטול',
            type: 'button-assertive',
            onTap: function (e) {
                return $scope.data.note;
            }
          },
        ]
      });
      myPopup.then(function (res) {
        $scope.data.note = res;
      });
    }; // NotePopup
    //--------------------------------------------------------------
    //--           Button Action
    //--------------------------------------------------------------
    $scope.showBtnActions = function() {
      var buttons         = PelApi.getButtons($scope.buttonsArr);
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons        : buttons,
        titleText      : 'רשימת פעולות עבור טופס',
        cancelText     : 'ביטול',
        //-----------------------------------------------
        //--               CANCEL
        //-----------------------------------------------
        cancel: function () {
          // add cancel code..
          return true;
        },
        //-----------------------------------------------
        //--               BUTTONS
        //-----------------------------------------------
        buttonClicked: function (index,button) {
          var note = $scope.data.note;
          // add buttons code..
          if(button === appSettings.OK){
            $scope.submitNotif("OK", note);
          }
          if(button === appSettings.APPROVE){

            $scope.submitNotif("APPROVE", note);
          }
          if(button === appSettings.REJECT){
            $scope.docReject();
          }
          return true;
        },
        //-----------------------------------------------
        //--           DESTRUCTIVE BUTTON
        //-----------------------------------------------

      });
    }

    $scope.doRefresh();

  }])
;
