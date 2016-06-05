// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('pele', ['ionic'
                           ,'ngCordova'
                           ,'ngStorage'
                           ,'tabSlideBox'
                           ,'pele.controllers'
                           ,'pele.factories'
                           ,'pele.config'
                           ,'pele.services'
                           ,'fileLogger'
                          ])

.run(function($ionicPlatform , $state , $ionicLoading , $fileLogger , PelApi , appSettings  ) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    //-----------------------------------------
    //--   Registration for Push Notification
    //-----------------------------------------
    var notificationOpenedCallback = function(jsonData) {
    };
    if(window.plugins !== undefined) {
      window.plugins.OneSignal.init("1d0135a7-da67-4953-b241-2385bfcedcd9", {googleProjectNumber: "655668363586"}, notificationOpenedCallback);

      window.plugins.OneSignal.getIds(function(ids) {
        config_app.PLAYER_ID = ids.userId;
        //document.getElementById("OneSignalUserID").innerHTML = "UserID: " + ids.userId;
        //document.getElementById("OneSignalPushToken").innerHTML = "PushToken: " + ids.pushToken;
        console.log('getIds: ' + JSON.stringify(ids));
      });
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

      //----------------------------------------
      //--    Get Version from config.xml
      //----------------------------------------
      window.cordova.getAppVersion(function (version) {
        config_app.APP_VERSION = version;
      });
      console.log("VERSION : " + config_app.APP_VERSION);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //----------------------------------
    //--    Create/Open Log File
    //----------------------------------
    $fileLogger.setStorageFilename(config_app.LOG_FILE_NAME);
    //----------------------------------
    //--   Delete Old Log File data
    //----------------------------------
    $fileLogger.deleteLogfile();
    //----------------------------------
    //--  Write open row to log file
    //----------------------------------
    PelApi.writeToLog(config_app.LOG_FILE_INFO_TYPE ,'=============== Start ==============');

    //----------------------------------
    //--    Go To Application List
    //----------------------------------
    $state.go("app.p1_appsLists");

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  //---- P1 ----//
  .state('app.p1_appsLists', {
      url: '/p1_appsLists',
      views: {
        'menuContent': {
          templateUrl: 'templates/p1_appsLists.html',
          controller: 'P1_appsListCtrl'
        }
      }
    })
    //---- home ----//
    .state('app.home', {
      url: '/home/:showLoading',
      views: {
        'menuContent': {
          templateUrl: 'templates/p1_appsLists.html',
          controller: 'homeCtrl'
        }
      }
    })
    .state('app.settings', {
        url: '/settings',
        views:{
          'menuContent': {
            templateUrl: 'templates/settings/settingsList.html',
            controller: 'SettingsListCtrl'
          }
        }
    })
    .state('app.settings.sendLog', {
        url: '/sendLog',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings/sendLog.html',
            controller: 'SendLogCtrl'
          }
        }
  })
  .state('app.appProfile', {
      url: '/appProfile',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings/appProfile.html',
          controller: 'AppProfileCtrl'
        }
      }
    })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home',{'showLoading':'Y'});
});
