/**
 * Created by User on 12/12/2016.
 */
var app = angular.module('pele.p2_scan_printCtrl', ['ngStorage']);
app.controller('p2_scan_printCtrl', function($scope, $stateParams , $cordovaBarcodeScanner, $ionicLoading ,$ionicPopup,$localStorage,$ionicModal, PelApi){



  $scope.modal = $ionicModal.fromTemplate( '<ion-modal-view>' +
        ' <ion-header-bar>' +
           '<h1 class = "title"> שחרור הדפסה</h1>' +
        '</ion-header-bar>' +

        '<ion-content>'+
        '<center><img src="img/qrcode.jpg"/></center> <div dir="RTL"><br> ניתן לשחרר הדפסות רק אם הם נשלחו למדפסת BW <br> בכדי לשחרר את ההדפסה יש לגשת למדפסת שבה רוצים להדפיס ולסרוק את ה QR קוד שצמוד למדפסת</div>'+
           '<button class = "button icon icon-left ion-ios-close-outline"  ng-click = "closeModal()">Close Modal</button>' +
        '</ion-content>' +

     '</ion-modal-view>', {
        scope: $scope,
        animation: 'slide-in-up'
     })

     $scope.openModal = function() {
        $scope.modal.show();
     };

     $scope.closeModal = function() {
        $scope.modal.hide();
          $scope.doRefresh();
     };

     //Cleanup the modal when we're done with it!
     $scope.$on('$destroy', function() {
        $scope.modal.remove();
     });

     // Execute action on hide modal
     $scope.$on('modal.hidden', function() {
        // Execute action
     });

     // Execute action on remove modal
     $scope.$on('modal.removed', function() {
        // Execute action
     });


$scope.doSomething=function(){




$scope.openModal();
// 
// if (window.localStorage.getItem("barcodetip") === "null"){
//     //
//   var confirmPopup = $ionicPopup.confirm({
//        title: 'שחרור הדפסה',
//        template: '<center><img src="img/qrcode.jpg"/></center> <div dir="RTL"><br> ניתן לשחרר הדפסות רק אם הם נשלחו למדפסת BW <br> בכדי לשחרר את ההדפסה יש לגשת למדפסת שבה רוצים להדפיס ולסרוק את ה QR קוד שצמוד למדפסת</div>'
//      });
//
//
//
//      confirmPopup.then(function(res) {
//        if(res) {
//          console.log('You are sure');
//          console.log('===== p2_scan_printCtrl ====');
//
//          $scope.doRefresh();
//        } else {
//            window.localStorage.setItem("barcodetip", "0");
//          console.log('You are not sure');
//          console.log('===== p2_scan_printCtrl ====');
// window.localStorage.setItem("barcodetip", "1");
//          $scope.doRefresh();
//        }
//      });
// }
// else {
//
//   console.log('===== p2_scan_printCtrl ====');
//
//
// }

   };

    //-----------------------------------------//
    //--         scanBarcode
    //-----------------------------------------//
    $scope.doRefresh = function() {

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');

      PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE ,"IN p2_scan_printCtrl.scanBarcode();");
      console.log("======== in scanBarcode ==========");
      if(window.cordova != undefined){
        $cordovaBarcodeScanner.scan()


        .then(function(imageData) {

          if (!imageData.cancelled)
          {

          var printUrl = imageData.text;

          var patt = new RegExp(config_app.MSSO_PRINT_URL);
          var res = patt.test(printUrl);
          if(res) {
            var sendScanPrint = PelApi.sendScanPrint(printUrl)

            sendScanPrint.then(
              //----------------//
              //--   SUCCESS  --//
              //----------------//
              function () {
                sendScanPrint.success(function (data, status, headers, config) {
                  console.log("SUCCESS : sendScanPrint.success");
                  PelApi.goHome();
                });
              }
              //----------------//
              //--   ERROR  --//
              //----------------//
              , function (response) {
                console.log("ERROR_1 p2_scan_printCtrl.scanBarcode() :" + JSON.stringify(response));
                PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE, " 1 . p2_scan_printCtrl.scanBarcode() - " + JSON.stringify(response));
                PelApi.showPopup(config_app.interfaceErrorTitle, "");
                PelApi.goHome();

              }
            );
          }else{
            PelApi.showPopup(config_app.MSSO_PRINT_WRONG_BARCODE, "");
          }
          console.log("Barcode Format -> " + imageData.format);
          console.log("Cancelled -> " + imageData.cancelled);
        }else {
            PelApi.goHome();
        }
      }, function(error) {

          console.log("ERROR_2 An error happened -> " + error);
          PelApi.writeToLog(config_app.LOG_FILE_ERROR_TYPE ," 2 . p2_scan_printCtrl.scanBarcode() - " + JSON.stringify(error));
          PelApi.showPopup(config_app.SCAN_PRINT_SCANNING_ERROR, "");
          PelApi.goHome();
        });
      }
    };


  }
); // p2_scan_printCtrl
