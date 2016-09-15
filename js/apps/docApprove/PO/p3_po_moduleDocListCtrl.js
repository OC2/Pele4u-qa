/**
 * Created by User on 25/08/2016.
 */
var app = angular.module('pele.p3_po_moduleDocListCtrl', ['ngStorage']);
//====================================================================================
//==                                  PAGE_3
//====================================================================================
app.controller('p3_po_moduleDocListCtrl', function($scope,
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

    $scope.shownGroup = config_app.PO_ORG_NAME;

    var appId = $stateParams.AppId,
      formType = $stateParams.FormType,
      pin = $stateParams.Pin;

    PelApi.delete_ATTACHMENT_DIRECTORY_NAME();

    var links = PelApi.getDocApproveServiceUrl("GetUserPoOrdGroup");

    var retGetUserFormGroups = PelApi.GetUserPoOrdGroupGroup(links, appId, formType, pin);

    retGetUserFormGroups.then(
      //--- SUCCESS ---//
      function () {

        retGetUserFormGroups.success(function (data, status, headers, config) {

          PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE, JSON.stringify(data));

          var stat = PelApi.GetPinCodeStatus2(data, "GetUserPoOrdGroupGroup");
          var pinStatus = stat.status;

          console.log(data);

          if ("Valid" === pinStatus) {
            if(data.Response.OutParams.P_ERROR_CODE !== 0 ){
              var errorMsg = data.Response.OutParams.P_ERROR_DESC;
              PelApi.showPopup(errorMsg, "");
            }else{
              $scope.chats = data.Response.OutParams.ROW;
              console.log($scope.chats);
              $scope.title = "אישור הזמנות רכש";
              var rowLength = $scope.chats.length;

              var emptyFlag = "N";
              try{
                if($scope.chats[0].ORDER_QTY !== undefined) {
                  emptyFlag = "N";
                }else{
                  emptyFlag = "Y";
                }
              }catch(e){
                emptyFlag = "Y";
              }
              if("N" === emptyFlag){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
              }else{
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                var appId = $stateParams.AppId,
                  formType = $stateParams.FormType,
                  pin = $stateParams.Pin;

                $state.go("app.p2_moduleList",{"AppId": appId, "Title": "", "Pin": pin});
              }

              //}
            }
          } else if ("PDA" === pinStatus) {

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            //$scope.login();
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();

          } else if("EOL" === pinStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();

          } else if ("InValid" === pinStatus) {

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            //$state.go("app.p1_appsLists");
            config_app.IS_TOKEN_VALID = "N";
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
    /*
     }
     */
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
  $scope.forwardToDoc = function(docId , docInitId , orgName){
    console.log("========================");
    console.log(orgName);
    console.log("========================");
    var appId = config_app.appId;
    $scope.appId = config_app.appId;
    var statePath = 'app.doc_' + docId;
    PelApi.showLoading();

    var links = PelApi.getDocApproveServiceUrl("GetUserNotif");

    var retGetUserNotifications = PelApi.GetUserNotifications(links, appId, docId, docInitId);
    retGetUserNotifications.then(
      //--- SUCCESS ---//
      function () {
        retGetUserNotifications.success(function (data, status, headers, config) {

          var strData = JSON.stringify(data);
          console.log(strData);
          strData = strData.replace(/\\\\b/g, " ");
          strData = strData.replace(/\\\\t/g, "   ");
          strData = strData.replace(/\\/g, "");
          strData = strData.replace(/"{/g, "{");
          strData = strData.replace(/}"/g, "}");
          console.log("======================================");
          console.log(strData);
          console.log("======================================");

          var stat = PelApi.GetPinCodeStatus2(data, "GetUserNotif");
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

            try {
              config_app.ATTACHMENT_TIME_OUT = newData.Response.OutParams.Result.ROWSET.ROW.ATTACHMENT_DOWNLOAD_TIME_OUT;
            }catch(e){
              config_app.ATTACHMENT_TIME_OUT = 10000;
            }

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

            config_app.PO_ORG_NAME = orgName;

            $state.go(statePath, {"AppId": $scope.appId, "DocId": docId, "DocInitId": docInitId , "orgName": orgName});

          } else if("EOL" === pinStatus){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();

          } else if ("EAI_ERROR" === pinStatus){

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.EAI_ERROR_DESC, "");

          } else if ("ERROR_CODE" === pinStatus){

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(stat.description, "");

          }else if ("PCR" === pinStatus) {

            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            config_app.IS_TOKEN_VALID = "N";
            PelApi.goHome();

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
  } // forwardToDoc
  //----------------------------------------------//
  //--                 Main                     --//
  //----------------------------------------------//
  $scope.feed = [];
  $scope.searchText = {};
  $scope.doRefresh();

});
