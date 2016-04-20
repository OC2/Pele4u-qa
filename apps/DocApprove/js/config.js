angular.module('pele.config', [])
.constant('WORDPRESS_API_URL', 'http://wordpress.startapplabs.com/blog/api/')
.constant('GCM_SENDER_ID', '574597432927')
.constant('appSettings', {
    api:"http://msso.pelephone.co.il/PCBarCode/PrintCenterBar.asmx/WhoMI" ,
    usermenuAPIURL:"http://msso.pelephone.co.il/MobileServices/SSOService.svc/json/GetUserMenu",
    userModuleTypes:"http://msso.pelephone.co.il/REST/GetUserModuleTypes",
    userFormGroups:"http://msso.pelephone.co.il/REST/GtUserFormGroups",
    userNotifications:"http://msso.pelephone.co.il/REST/GetUserNotif",
    userSubmitNotification:"http://msso.pelephone.co.il/REST/SubmitNotif",
    sapi:"https://msso.pelephone.co.il/PCBarCode/PrintCenterBar.asmx/WhoMI" ,
    timeout:15000,
    menuTimeout:15000,
    translateFlag:"N",
    flashTime: 2500 ,
    getUserMenuError: "שגיאת קבלת התפריטים למשתמש, קוד שגיאה - ",
    MODULE_TYPES_FORWARD_PATH : {"HR" : "app.p3_moduleDocList" , "POAPPRV" : "app.po_p3_moduleDocList"},
    ACTION_HISTORY:{"FORWARD":"אישור" , "NO_ACTION":"לא נדרש אישור" , "REJECT":"דחייה" ,"WAITING":"ממתין" },
    APPROVE : {text: '<i id="APPROVE" class="icon ion-checkmark-circled text-center"></i> אישור'},
    APPROVE_AND_NOTE : {text: '<i id="APPROVE_AND_NOTE" class="icon ion-checkmark-circled text-center"></i> אישור עם הערה'},
    OK      : {text: '<i id="OK"      class="icon ion-checkmark-circled text-center"></i> אישור'},
    REJECT  : {text: '<i id="REJECT"  class="icon ion-close-circled     text-center" style="color:#F71914"></i> דחיה'},
    enviroment:"QA",
    enviromentLinks:[
                      { Environment:"CURRENT",
                        ServiceList:[{"Service": "GetUserMenu",
                          "URL":"http://msso.pelephone.co.il/MobileServices/SSOService.svc/json/GetUserMenu",
                          "RequestHeader":""
                          },
                          {"Service":"GetUserModuleTypes",
                            "URL":"http://msso.pelephone.co.il/REST/GetUserModuleTypes",
                            "RequestHeader":{"ServiceName": "GetUserModuleTypes","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"GtUserFormGroups",
                            "URL":"http://msso.pelephone.co.il/REST/GtUserFormGroups",
                            "RequestHeader":{"ServiceName": "GetUserFormGroups","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"GetUserNotif",
                            "URL":"http://msso.pelephone.co.il/REST/GetUserNotif",
                            "RequestHeader":{"ServiceName": "GetUserNotifications","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"SubmitNotif",
                            "URL":"http://msso.pelephone.co.il/REST/SubmitNotif",
                            "RequestHeader":{"ServiceName": "SubmitNotifications","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {	"Service":"GetUserPoOrdGroup",
                            "URL":"http://msso.pelephone.co.il/QA/REST/GetUserPoOrdGroup",
                            "RequestHeader":{"ServiceName": "GetUserPoOrdGroup","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          }
                        ]
                      },
                      { Environment:"PD",
                        ServiceList:[{"Service":"GetUserMenu",
                          "URL":"http://msso.pelephone.co.il/PD/MobileServices/SSOService.svc/json/GetUserMenu",
                          "RequestHeader":""
                          },
                          {"Service":"GetUserModuleTypes",
                            "URL":"http://msso.pelephone.co.il/PD/REST/GetUserModuleTypes",
                            "RequestHeader":{"ServiceName": "GetUserModuleTypes","AppID": "MobileApp","EnvCode": "MobileApp_PROD","Timeout": "10000"}
                          },
                          {	"Service":"GtUserFormGroups",
                            "URL":"http://msso.pelephone.co.il/PD/REST/GtUserFormGroups",
                            "RequestHeader":{"ServiceName": "GetUserFormGroups","AppID": "MobileApp","EnvCode": "MobileApp_PROD","Timeout": "10000"}
                          },
                          {	"Service":"GetUserNotif",
                            "URL":"http://msso.pelephone.co.il/PD/REST/GetUserNotif",
                            "RequestHeader":{"ServiceName": "GetUserNotifications","AppID": "MobileApp","EnvCode": "MobileApp_PROD","Timeout": "10000"}
                          },
                          {	"Service":"SubmitNotif",
                            "URL":"http://msso.pelephone.co.il/PD/REST/SubmitNotif",
                            "RequestHeader":{"ServiceName": "SubmitNotifications","AppID": "MobileApp","EnvCode": "MobileApp_PROD","Timeout": "10000"}
                          },
                          {	"Service":"GetUserPoOrdGroup",
                            "URL":"http://msso.pelephone.co.il/PD/REST/GetUserPoOrdGroup",
                            "RequestHeader":{"ServiceName": "GetUserPoOrdGroup","AppID": "MobileApp","EnvCode": "MobileApp_PROD","Timeout": "10000"}
                          }
                        ]
                      },
                      {Environment:"QA",
                        ServiceList:[{"Service":"GetUserMenu",
                          URL:"http://msso.pelephone.co.il/QA/MobileServices/SSOService.svc/json/GetUserMenu",
                          "RequestHeader":""
                          },
                          {"Service":"GetUserModuleTypes",
                            "URL":"http://msso.pelephone.co.il/QA/REST/GetUserModuleTypes",
                            "RequestHeader":{"ServiceName": "GetUserModuleTypes","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"GtUserFormGroups",
                            "URL":"http://msso.pelephone.co.il/QA/REST/GtUserFormGroups",
                            "RequestHeader":{"ServiceName": "GetUserFormGroups","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"GetUserNotif",
                            "URL":"http://msso.pelephone.co.il/QA/REST/GetUserNotif",
                            "RequestHeader":{"ServiceName": "GetUserNotifications","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {"Service":"SubmitNotif",
                            "URL":"http://msso.pelephone.co.il/QA/REST/SubmitNotif",
                            "RequestHeader":{"ServiceName": "SubmitNotifications","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          },
                          {	"Service":"GetUserPoOrdGroup",
                            "URL":"http://msso.pelephone.co.il/QA/REST/GetUserPoOrdGroup",
                            "RequestHeader":{"ServiceName": "GetUserPoOrdGroup","AppID": "MobileApp","EnvCode": "MobileApp_QA","Timeout": "10000"}
                          }
                        ]
                      },
                      {Environment:"DV",
                        ServiceList:[{	"Service":"GetUserMenu",
                          "URL":"http://msso.pelephone.co.il/DV/MobileServices/SSOService.svc/json/GetUserMenu",
                          "RequestHeader":""
                          },
                          {	"Service":"GetUserModuleTypes",
                            "URL":"http://msso.pelephone.co.il/DV/REST/GetUserModuleTypes",
                            "RequestHeader":{"ServiceName": "GetUserModuleTypes","AppID": "MobileApp","EnvCode": "MobileApp_DEV","Timeout": "10000"}
                          },
                          {	"Service":"GtUserFormGroups",
                            "URL":"http://msso.pelephone.co.il/DV/REST/GtUserFormGroups",
                            "RequestHeader":{"ServiceName": "GetUserFormGroups","AppID": "MobileApp","EnvCode": "MobileApp_DEV","Timeout": "10000"}
                          },
                          {	"Service":"GetUserNotif",
                            "URL":"http://msso.pelephone.co.il/DV/REST/GetUserNotif",
                            "RequestHeader":{"ServiceName": "GetUserNotifications","AppID": "MobileApp","EnvCode": "MobileApp_DEV","Timeout": "10000"}
                          },
                          {	"Service":"SubmitNotif",
                            "URL":"http://msso.pelephone.co.il/DV/REST/SubmitNotif",
                            "RequestHeader":{"ServiceName": "SubmitNotifications","AppID": "MobileApp","EnvCode": "MobileApp_DEV","Timeout": "10000"}
                          },
                          {	"Service":"GetUserPoOrdGroup",
                            "URL":"http://msso.pelephone.co.il/DV/REST/GetUserPoOrdGroup",
                            "RequestHeader":{"ServiceName": "GetUserPoOrdGroup","AppID": "MobileApp","EnvCode": "MobileApp_DEV","Timeout": "10000"}
                          }
                        ]
                      }
                    ]
})
;


var config_app;
config_app = {
  APP_VERSION:108,
  fileLogger:"",
  LOG_FILE_NAME: "Pele4U.txt",
  LOG_FILE_MAIL_RECIPIENT: "Mobile_Admins_HR@pelephone.co.il",
  LOG_FILE_MAIL_SUBJECT: "Pele4U Log File",
  LOG_FILE_INFO_TYPE: "I",
  LOG_FILE_DEBUG_TYPE: "D",
  LOG_FILE_ERROR_TYPE: "E",
  LOG_FILE_WARN_TYPE: "W",
  WIFI_CHECK: true,
  network: "",
  isOnline: "",
  pinCodeLock: false,
  interfaceErrorTitle: "שגיאת ממשק",
  wifiTitle: "WiFi- יש להתנתק מ",
  wifiSubTitle: "האפליקציה פעילה ברשת סלולארית בלבד",
  declineTitle: "לפני דחייה",
  declineSubTitle: "חובה להזין הערה",
  pinCodeErrorVal: "קוד מחמיר שגוי",
  pinCodeErrorInit: "לא הוגדר קוד מחמיר. יש להגדיר בפורטל או ב-55",
  pinCodeErrorLock: "קוד מחמיר נעול. יש להגדיר קוד חדש בפורטל או ב-55",
  pinCodeSubTitlePCR: "חובה להזין קוד מחמיר",
  pinCodeSubTitlePWA: "קוד מחמיר שגוי",
  pinCodeSubTitlePDA: "קוד מחמיר חסום. יש להגדיר קוד חדש בפורטל או ב-55",
  pinCodeSubTitlePNE: "קוד מחמיר לא קיים ...",
  pinCodeSubTitleNRP: "קוד מחמיר נעול. צריך לאפס ...",
  getUserMenuErrorMsg: "שגיאה בטעינת רשימת אפליקציות",
  getUserModuleTypesErrorMag: "בקשה הסתיימה עם שגיאה , נא לרענן מסך",
  EAI_ERROR_DESC : "EAI שגיאה בממשק",
  loadingMsg: "ממתין לטעינת נתונים ...",
  isAddNoteTitle: "האם ברצונך להוסיף הערה?",
  errorMsg: "",
  pinCodeErrorInd: "N",
  pinCodeReq: "Y",
  token: "",
  appId:"2313E2E95ADDFDB3E050AE0A5B0768D2",
  user: "",
  userName: "",
  PIN: "0",
  GetUserMenu: "",
  GetUserModuleTypes: "",
  tabs: [{"text": "סבב מאשרים"}, {"text": "תוכן הטופס"}],
  PIN_STATUS: {
    "EOL": "",//- End of life
    "PAD": "גישה נחסמה, נה לפנות ל 55 ...", // - Pin access denied after 3 time
    "PWA": "גישה הלא נכונה ...", // - Pin wrong access
    "NRP": "קוד מחמיר נעול. צריך לאפס ...", // - Need to reset Pin
    "PNE": "קוד מחמיר לא קיים ...", //  Pin not Exist
    "PCR": "הזינו קוד מחמיר, אפליקצייה דורשת הזדהות",
    "InValid": "",// - general error
    "Valid": "",
    "SYS_ERROR": "שגיאה מערכתי ..."
  },
  adv: {
    "ROWSET": {
      "ROW": [
        {
          "IMG": "1",
          "TEXT": "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים" +
          "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים" +
          "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים"
        },
        {
          "IMG": "2",
          "TEXT": "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים" +
          "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים" +
          "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים"
        },
        {
          "IMG": "3",
          "TEXT": "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים"
        },
        {
          "IMG": "4",
          "TEXT": "טקסת חופשי כהשלה לתמונה ניתן לכתוב עד 500 תווים"
        }
      ]
    }
  },
  docDetails: {},
  ApprovRejectBtnDisplay: true,
};

