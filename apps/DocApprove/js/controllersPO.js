/**
 * Created by User on 18/02/2016.
 */
var app = angular.module('pele.controllersPO', ['ngStorage']);
//====================================================================================
//==                                  PAGE_3
//====================================================================================
app.controller('po_p3_moduleDocListCtrl', function($scope,
                                                $stateParams,
                                                $http,
                                                $q,
                                                $ionicLoading,
                                                $state ,
                                                PelApi ,
                                                $cordovaNetwork ,
                                                $sessionStorage) {

  //---------------------------------
  //--       goHome
  //---------------------------------
  $scope.goHome = function () {
    PelApi.goHome();
  }
  //----------------------- REFRESH ------------------------//
  $scope.doRefresh = function () {

    PelApi.showLoading();

    var sessionDocId = $sessionStorage.DOC_ID;
    $scope.toggleGroup(sessionDocId);

    var appId = config_app.appId,
      formType = $stateParams.FormType,
      pin = $stateParams.pin;
    if ("wifi" === config_app.network) {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      PelApi.showPopup(config_app.wifiTitle, config_app.wifiSubTitle);
    }
    else {

      var links = PelApi.getDocApproveServiceUrl("GetUserPoOrdGroup");

      var retGetUserFormGroups = PelApi.GetUserPoOrdGroupGroup(links, appId, formType, pin);

      retGetUserFormGroups.then(
        //--- SUCCESS ---//
        function () {

          retGetUserFormGroups.success(function (data, status, headers, config) {

            PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE, JSON.stringify(data));

            var stat = PelApi.GetPinCodeStatus(data, "GetUserPoOrdGroupGroup");
            var pinStatus = stat.status;

            console.log(data);

            if ("Valid" === pinStatus) {

              if(data.Response.OutParams.P_ERROR_CODE !== 0 ){

                var errorMsg = data.Response.OutParams.P_ERROR_DESC;
                PelApi.showPopup(errorMsg, "");

              }
              else{
                /*
                try{
                  if(data.Response.OutParams.ROW[0].ORG_NAME === undefined){
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    PelApi.goHome();
                  }
                }catch(e){
                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  PelApi.goHome();
                }
                if (data.Response.OutParams.ROW[0].ORG_NAME === null) {

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  PelApi.goHome();

                } else {
                */
                  $scope.chats = data.Response.OutParams.ROW;
                  console.log($scope.chats);
                  $scope.title = "אישור הזמנות רכש";
                  var rowLength = $scope.chats.length;

                  if (rowLength > 0) {
                    $scope.title = $scope.chats[0].DOC_TYPE;
                  }

                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                //}
              }
            } else if ("PDA" === pinStatus) {

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              $scope.login();

            } else if("EOL" === pinStatus){
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.goHome();

            } else if ("InValid" === pinStatus) {

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              //$state.go("app.p1_appsLists");
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
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.getUserModuleTypesErrorMag, "");
          });
        }
        //--- ERROR ---//
        , function () {
          retGetUserFormGroups.success(function (data, status, headers, config) {

            PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE, "success : " + JSON.stringify(data));

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.getUserModuleTypesErrorMag, "");

          }).error(function (data, status, headers, config) {

            PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE, "error : " + JSON.stringify(data));

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.getUserModuleTypesErrorMag, "");
          });
        }
      );
    }
  };
  //---------------------------------------------------------
  //-- When        Who       Description
  //-- ==========	 ========  ================================
  //-- 20/10/2015  R.W.      Accordion functions
  //---------------------------------------------------------
  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
  //----------------------------------------------------------
  //-- Search bar JSON rebild
  //----------------------------------------------------------
  $scope.searchBarCreteria = function () {
    var searchText = $scope.searchText.text;
    if ($scope.searchText.text !== undefined && $scope.searchText.text !== "") {
      list = $scope.chats;
      for (var i = 0; i < list.length; i++) {
        var sCount = 0;
        for (var j = 0; j < list[i].ORDER_DETAILS.ORDER_DETAILS_ROW.length; j++) {
          var vendor = list[i].ORDER_DETAILS.ORDER_DETAILS_ROW[j].VENDOR_NAME;
          var vI = vendor.indexOf(searchText);

          var order = list[i].ORDER_DETAILS.ORDER_DETAILS_ROW[j].PO_ORDER;
          var oI = order.indexOf(searchText);

          var amount = list[i].ORDER_DETAILS.ORDER_DETAILS_ROW[j].PO_AMOUNT;
          var aI = amount.indexOf(searchText);


          if (-1 !== vI || -1 !== oI || -1 !== aI ) {
            sCount++;
          }
        }
        $scope.chats[i].ORDER_QTY = sCount;
      }
    }
    else {
      for (var i = 0; i < list.length; i++) {
        var sCount = list[i].ORDER_DETAILS.ORDER_DETAILS_ROW.length;
        $scope.chats[i].ORDER_QTY = sCount;
      }
    }
  }
  //--------------------------------------------------------------
  //-- When        Who         Description
  //-- ----------  ----------  -----------------------------------
  //-- 01/11/2015  R.W.        function forward to page by DOC_ID
  //--------------------------------------------------------------
  $scope.forwardToDoc = function(docId , docInitId){
    var appId = config_app.appId;
    $scope.appId = config_app.appId;
    var statePath = 'app.doc_' + docId;
    if("wifi" === config_app.network){
      PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
    }else {
      PelApi.showLoading();

      var links = PelApi.getDocApproveServiceUrl("GetUserNotif");

      var retGetUserNotifications = PelApi.GetUserNotifications(links, appId, docId, docInitId);
      retGetUserNotifications.then(
        //--- SUCCESS ---//
        function () {
          retGetUserNotifications.success(function (data, status, headers, config) {

            var strData = JSON.stringify(data);
            strData = strData.replace(/\\/g, "");
            strData = strData.replace(/"{/g, "{");
            strData = strData.replace(/}"/g, "}");
            console.log("======================================");
            console.log(strData);
            console.log("======================================");

            var stat = PelApi.GetPinCodeStatus(data, "GetUserNotif");
            var pinStatus = stat.status;
            if("Valid" === pinStatus) {
              PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE, JSON.stringify(data));

              var newData = JSON.parse(strData);
              try {
                config_app.docDetails = newData.Response.OutParams.Result.ROWSET.ROW;
              } catch (e) {

              }

              var buttonsLength = config_app.docDetails.BUTTONS.length;
              // Show the action sheet
              if (2 === buttonsLength) {
                config_app.ApprovRejectBtnDisplay = true;
              } else {
                config_app.ApprovRejectBtnDisplay = false;
              }

              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');

              $state.go(statePath, {"AppId": $scope.appId, "DocId": docId, "DocInitId": docInitId});

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
    }
  } // forwardToDoc

  $scope.feed = [];
  $scope.searchText = {};
  $scope.doRefresh();

});

//======================================================================================
//                                   PAGE_4
//======================================================================================
/*
app.controller('PoDocCtrl',['$rootScope'
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
  ,'$cordovaFileTransfer'
  ,'$cordovaInAppBrowser'
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
    , $cordovaFileTransfer
    , $cordovaInAppBrowser
  ) {
*/
    app.controller('PoDocCtrl'
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
          , $cordovaFileTransfer
          , $cordovaInAppBrowser
          , $cordovaFileOpener2
        ) {

    //---------------------------------
    //--       goHome
    //---------------------------------
    $scope.goHome = function(){
      PelApi.goHome();
    }
    //------------------------------------------
    //--      getApproveListActionIcon
    //------------------------------------------
    $scope.getApproveListActionIcon=function(actionCode , date , note){

      var icon_class;
      if("FORWARD" === actionCode){
        icon_class = "ion-checkmark-circled";
      }else if("NO ACTION" === actionCode){
        icon_class = "ion-minus-circled";
      }else if("REJECT" === actionCode){
        icon_class = "ion-close-circled";
      }else if(actionCode === null && date !== null && note !== null){
        icon_class = "ion-chatbubble-working";
      }else {
        icon_class = "";
      }

      return icon_class;


    } // getApproveListActionIcon

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
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    //============================================================================//
    //== When        Who         Description                                    ==//
    //== ----------  ----------  -----------------------------------------------==//
    //== 23/02/2016  R.W.                                                       ==//
    //============================================================================//
    $scope.addPushFlagToActionHistory = function(arr){
      var myArr = [];
      var j = arr.length;
      for(var i = 0; i < arr.length ; i++ , j--){
        var showFlag = false;
        var hideFlag = false;
        if( arr[j-1].DISPLAY_FLAG === "N"){
          showFlag = true;
        }else if(arr[j-1].NOTE !== "" && arr[j-1].NOTE != undefined){
          showFlag = false;
        }else{
          showFlag = true
        };
        //---------------------------------------
        //-- Calculate
        //---------------------------------------
        var l_displayFlag = arr[j-1].DISPLAY_FLAG;
        var l_actionCode = arr[j-1].ACTION_CODE;
        if(arr[j-1].DISPLAY_FLAG === "N"){
          hideFlag = true;
        } else if((arr[j-1].ACTION_CODE === "" || arr[j-1].ACTION_CODE === undefined || arr[j-1].ACTION_CODE === null)
         && (arr[j-1].CHAR_ACTION_DATE === "" || arr[j-1].CHAR_ACTION_DATE === undefined || arr[j-1].CHAR_ACTION_DATE === null)){
          hideFlag = true
        }

        var mayObj = {
            "DISPLAY_FLAG":arr[j-1].DISPLAY_FLAG,
            "OBJECT_ID":arr[j-1].OBJECT_ID,
            "CHAR_ACTION_DATE":arr[j-1].CHAR_ACTION_DATE,
            "ACTION_CODE":arr[j-1].ACTION_CODE,
            "ACTION_CODE_DISP":arr[j-1].ACTION_CODE_DISP,
            "EMPLOYEE_NAME":arr[j-1].EMPLOYEE_NAME,
            "NOTE":arr[j-1].NOTE,
            "SEQUENCE_NUM":i+1,
            "SHOW_FLAG": showFlag,
            "HIDEN_FLAG": hideFlag,
            "PUSH_COUNT": 0
        }

        myArr.push(mayObj);

      }// for

      return myArr;
    }// addPushFlagToActionHistory
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
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.getMatchPrice = function(arr){
      var myArr = [];
      for(var i = 0 ; i < arr.length ; i++ ){

        if( arr[i].DISPLAY_FLAG === "Y") {

          var mayObj = {
            "SEQ"                : i,
            "VENDOR_NAME"        : arr[i].VENDOR_NAME,
            "INITIAL_UNIT_PRICE" : arr[i].INITIAL_UNIT_PRICE,
            "UNIT_PRICE"         : arr[i].UNIT_PRICE,
            "TOTAL_PRICE"        : arr[i].TOTAL_PRICE
          }

          myArr.push(mayObj);

        } // if

      }// for

      return myArr;
    };// getMatchPrice
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.getAttachedDocuments = function(arr){
      var myArr = [];
      for(var i = 0 ; i < arr.length ; i++ ){

        if( arr[i].DISPLAY_FLAG === "Y") {

          var mayObj = {
            "SEQ"                : i,
            "CATEGORY_TYPE"      : arr[i].CATEGORY_TYPE,
            "DOCUMENT_ID"        : arr[i].DOCUMENT_ID,
            "FILE_NAME"          : arr[i].FILE_NAME,
            "FILE_TYPE"          : arr[i].FILE_TYPE,
            "FULL_FILE_NAME"     : arr[i].FULL_FILE_NAME,
            "OPEN_FILE_NAME"     : "/My Files &amp; Folders/" + arr[i].OPEN_FOLDER + '/' +  arr[i].FULL_FILE_NAME
          }

          myArr.push(mayObj);

        } // if

      }// for

      return myArr;
    }//getAttachedDocuments
    //---------------------------------------------------------------------------
    //--                      Open Attached Doc
    //---------------------------------------------------------------------------
    $scope.openAttachedFile = function( p_openFileName, p_fullFileName , p_fileType){

      PelApi.showLoading();

      var links = PelApi.getDocApproveServiceUrl("GetFileURI");

      var appId = config_app.appId;

      var retGetFileURI = PelApi.GetFileURI(links, appId , 0 , p_openFileName);

      retGetFileURI.then(

                //-- SUCCESS --//
        function()
        {
          retGetFileURI.success(function (data, status, headers, config){

              console.log("== GetFileURI.SUCCESS ==");
              var l_data = JSON.stringify(data);
              console.log(l_data);
              var statusCode = PelApi.checkResponceStatus(data);
              if("S" === statusCode.Status){
                var url = statusCode.URL;

                //window.open(url, '_system');
                var filename = p_fullFileName;

                var isIOS = ionic.Platform.isIOS();
                var isAndroid = ionic.Platform.isAndroid();

                //var targetPath ="file:///storage/emulated/0/po_1534624_210998_3945377.msg";
                var targetPath = "";

                if(isAndroid){
                  targetPath = cordova.file.externalRootDirectory + filename;
                }else if(isIOS){
                  targetPath = encodeURI(cordova.file.documentsDirectory + filename);
                }

                $cordovaFileTransfer.download( url
                                             , targetPath
                                             , {}
                                             , true).then(function (result){

                  console.log('Success');
                  console.log('===================================================');
                  console.log(result);
                  var options =
                  {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'no'
                  };
                  /*
                  $cordovaInAppBrowser.open(result.nativeURL, '_blank', options)
                    .then(function(event) {
                      console.log('then_2');
                      console.log('===================================================');
                      console.log(event);

                      $ionicLoading.hide();
                      $scope.$broadcast('scroll.refreshComplete');
                    })
                    .catch(function(event) {
                      console.log('catch_2');
                      console.log('===================================================');
                      console.log(event);
                    });
                    */
                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');

                  PelApi.showPopup(config_app.FileTransferSuccess, result.nativeURL);

                  //PelApi.showLoading();

                  window.open(result.nativeURL,"_system","location=yes,enableViewportScale=yes,hidden=no");
                  /*

                  if(isIOS){
                    window.open(file.nativeURL,"_system","location=yes,enableViewportScale=yes,hidden=no");
                  }else if( isAndroid ){

                    $cordovaFileOpener2.open(
                      result.nativeURL,
                      'application/pdf'
                    ).then(function() {
                        // file opened successfully
                        console.log('SUCCESS')
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                    }, function(err) {
                        // An error occurred. Show a message to the user
                        console.log('ERROR : ' + err);
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        PelApi.showPopup("Open File Complite With Error", err.toString());
                    });
                  }

                  */

                },function (error) {

                  console.log('Error');
                  console.log('===================================================');
                  console.log(error);
                  PelApi.showPopup("File Download Complite With Error", error.toString());

                }, function (progress) {
                  // PROGRESS HANDLING GOES HERE
                });

              } else if ("PDA" === statusCode.Status) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.login();

              } else if("EOL" === statusCode.Status){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.goHome();

              } else if ("InValid" === statusCode.Status) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                //$state.go("app.p1_appsLists");
                PelApi.goHome();

              } else if("EAI_Status" === statusCode.Status){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_Status, "");
              } else if("Application_Status" === statusCode.Status){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_Status, "");

              } else if("StatusCode" === statusCode.Status){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                PelApi.showPopup(config_app.EAI_Status, "");

              }

          });
        }
      );
    }
    //---------------------------------------------------------------------------
    //--                         doRefresh
    //---------------------------------------------------------------------------
    $scope.doRefresh = function() {
      $scope.data = {};
      $scope.feed = [];
      $scope.tabs = config_app.tabs;
      $scope.docDetailsShow = {};

      $scope.PO_COMMENTS_SHOW = true;
      $scope.PO_DETAILS_SHOW = true;
      $scope.PO_EXPLAIN_SHOW = true;
      $scope.PO_SUPPLIER_REASON_SHOW = true;
      $scope.PO_MATCH_PRICE_SHOW = true;
      $scope.PO_ATTACHED_DOCUMENTS_SHOW = true;

      var buttons = {};
      //buttons.approve = true;


      $scope.style = {
        color: 'red'
      };

      var appId = config_app.appId,
        docId = $stateParams.DocId,
        docInitId = $stateParams.DocInitId;

      $sessionStorage.DOC_ID = docId;

      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }
      else {
        if(config_app.docDetails.ERROR !== "NULL") {
          PelApi.showPopup(config_app.interfaceErrorTitle, config_app.docDetails.ERROR);
          return;
        }

        console.log(config_app.docDetails);
        //----------- Order Header -------------
        $scope.APP_ID = appId;
        $scope.NOTIFICATION_ID = config_app.docDetails.NOTIFICATION_ID;
        $scope.PO_ORDER = config_app.docDetails.PO_ORDER;
        $scope.COMMENTS = config_app.docDetails.COMMENTS;
        $scope.PO_AMOUNT = config_app.docDetails.PO_AMOUNT;
        $scope.CURRENCY = config_app.docDetails.CURRENCY;
        $scope.VENDOR_NAME = config_app.docDetails.VENDOR_NAME;
        $scope.SUBMIT_DATE = config_app.docDetails.SUBMIT_DATE;
        $scope.BUYER_NAME = config_app.docDetails.BUYER_NAME;
        $scope.MANAGER_NAME = config_app.docDetails.MANAGER_NAME;
        $scope.PO_EXPLAIN = config_app.docDetails.PO_EXPLAIN;
        $scope.SUPPLIER_REASON = config_app.docDetails.SUPPLIER_REASON;

        //----------- Match Price --------
        $scope.MATCH_PRICE = $scope.getMatchPrice(config_app.docDetails.MATCH_PRICE);
        console.log("================== MATCH PRICE ====================");
        console.log($scope.MATCH_PRICE);

        //----------- Attachments --------
        $scope.ATTACHED_DOCUMENTS = $scope.getAttachedDocuments(config_app.docDetails.ATTACHED_DOCUMENTS);
        console.log("================== ATTACHED_DOCUMENTS ====================");
        console.log(JSON.stringify($scope.ATTACHED_DOCUMENTS));

        //----------- Buttons ------------
        $scope.buttonsArr      = config_app.docDetails.BUTTONS;

        //----------- Action History -----
        var actionHistory = $scope.addPushFlagToActionHistory(config_app.docDetails.ACTION_HISTORY);
        $scope.ACTION_HISTORY = actionHistory;
        console.log("length : " + config_app.docDetails.ACTION_HISTORY.length);

        console.log("====================================================");
        console.log(JSON.stringify($scope.ACTION_HISTORY));
        console.log("====================================================");

        // Show the action sheet
        $scope.approve = config_app.ApprovRejectBtnDisplay;

        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');

      }
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
    $scope.pelHideShow = function(note , displayFlag){
      var retStatus = true;

      if(displayFlag==="Y"){

        if(note != "" && note != undefined ) {
          retStatus = false;
        }
      }else{
        retStatus = true;
      }

      return retStatus;
    };

    $scope.pelHideShow2 = function(displayFlag){

      var retStatus;

      if( displayFlag === "Y" ){
        retStatus = false;
      }else{
        retStatus = true;
      }

      return retStatus;
    }


    $scope.onSlideMove = function(data){
      //alert("You have selected " + data.index + " tab");
    };
    //-----------------------------------
    //--         Btn Action
    //-----------------------------------
    $scope.docApprove = function(){

      //PelApi.showLoading();

      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'APPROVE';
      var note = '';
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }else {
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
      }
    };
    //-----------------------------------
    //--         OK
    //-----------------------------------
    $scope.docOK = function(){

      //PelApi.showLoading();

      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'OK';
      var note = '';
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }
      else {
        PelApi.showLoading();
        var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
        var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
        retSubmitNotification.then(
          //---- SUCCESS -----//
          function () {
            retSubmitNotification.success(function (data, status, headers, config) {

              PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE , JSON.stringify(data));

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
      } // else WIFI
    };
    //----------------------------------------
    //--         REJECT                     --
    //----------------------------------------
    $scope.docReject = function(){
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = "REJECT";
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }else {
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
      }
    }; // docReject
    //==============================================================
    //==============================================================
    $scope.docApproveWitnNote = function(){
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = "APPROVE";
      if("wifi" === config_app.network){
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.wifiTitle , config_app.wifiSubTitle);
        //$state.go("app.p1_appsLists");
      }else {
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
      }
    }; // docApproveWitnNote
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    $scope.submitNotif = function(action , note){
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
          if (button === appSettings.OK) {

            $scope.submitNotif("OK", note);

          } else if (button === appSettings.APPROVE) {

            $scope.submitNotif("APPROVE", note);

          } else if (button === appSettings.APPROVE_AND_NOTE) {

            $scope.docApproveWitnNote();

          } else if(button === appSettings.REJECT){
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

}
//]
);
