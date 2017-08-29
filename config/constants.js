var config = require('config');
var constants = {
  statusCode:{
    400:" Bad Request",
  },
  messages:{
    errors:{
      "verified"                    :"Error in token verification",
      "auth"                        :"Authentication Error",
      "getData"                     :"get Data Error",
      "saveData"                    :"save Data Error",
      "noUser"                      :"No user found",
      "noOperation"                 :"no Operation found",
      "saveUser"                    : "Error in saving user",
      "undefined"                   :   "undefined value",
      "undefinedRole"               :   "undefined Role",
      "undefinedUsername"           :   "undefined Username",
      "undefinedEmail"              :   "undefined Email",
      "undefinedMobile"             :   "undefined mobile",
      "undefinedPassword"           :   "undefined Password",
      "undefinedFirstName"          :   "undefined undefinedFirstName",
      "undefinedEntererId"          :   "undefined Enterer Id",
      "undefinedUpdateUser"         :   "undefined Update  User Id",
      "ghNameRequired"              :   "guest house Name Required",
      "nameRequired"                :   " Name Required",
      "IDproofRequired"             :  "Idproof Required",
      "dateRequired"                :  "date Required",
      "mobileRequired"              :   " mobile Required",
      "addressRequired"             :   " address Required",
      "bookingStatusRequired"       :   " booking Status Required",
      "priceRequired"               :   " price Required",
      "roomIdRequired"              :   " roomID Required",
      "fromDateRequired"            :   " from Date Required",
      "toDateRequired"              :   " to Date Required",
      "guestHouseRequried"          :   " guest House Requried",
      "inValidDateLimit"            :   " inValid Date Limit",
      "invalidDateFormat"           : "invalid Date Format",
      "invalidRoomType"             :   " invalid Room Type",
      "roomTypeRequired"            :   " Room Type Required",
      "tranctionNoRequired"         :   " tranctionNo Required",
      "tranctionNoExist"      :   " tranction No. already Exist",
      "roomNoExist"      :   " Room No. already Exist",
      "transactionfailed"      :   " transaction failed",
      "checkInDateRequired"      :   " checkIn Date Required",
      "checkOutDateRequired"      :   " check Out Date Required",
      "userRequired"      :   "user Required",
      "lowerLimitRequired"      :   "lower Limit Required",
      "upperLimitRequired"      :   "upper Limit Required",
      "roomNoRequired"      :   "room No Required",
      "roomNotAvailable"      :   "room Not Available",
      "ghPriceRequired"      :   "guest house Price Required",
      "roomDeleteNotAvaiable"      :   "room Delete Not Avaiable as booked/checkIn ",
      "invalidOfferPrice"      :   "invalid Offer Price ",


      "guestHouseExist"      :   "guest House Exist ",
      "facilityExist"      :   "facility Exist ",


      "saveRole"      :   "Error in saving Role",
      "undefinedRole"      :   "Role is not defined",
        "fetchRoles"                 :   "Error in fetch Roles",
        "deleteRole"                 :   "Error in delete Roles",
        "udpateRole"                 :   "Error in udpate Roles",
        "login"                 :   "Login Failure",
        "changePassword"                 :   "Error in change Password",
        "changePasswordFailed"                 :   "Password malfunction",
        "forgetPasswordFailed"                 :   "forget Password Failed",
        "emailVerifiedError"                 :   "email Verified Error",
        "saveRole"                 :   "save Role Error",
        "udpateUser"                 :   "udpate User Error",
        "saveCustomer"                 :   "save Customer Error",
        "getCustomer"                 :   "get Customer Error",
        "saveGuestHouse"                 :   "save Guest House Error",
        "updateData"                 :   "update Data Error",
        "deleteData"                 :   "delete Data Error",
        "checkedIn"                 :   "checkedIn Error",
        "invalidPriceQuery"                 :   "Invalid Price in Query",

        //***** Cafirm ***** //
        "saveCafirm"                : "Error in saving Ca Firm",
        "getCafirm"                : "Error in fetch Ca Firm",
    },
    success:{
      "verified":"verified",
      "getData"   :"get Data Success",
      "saveData"   :"save Data Success",
      "saveUser"                 : "Success in saving user",
      "undefined"                :   "undefined value",
      "undefinedRole"            :   "undefined role",
      "undefinedEntererId"       :   "undefined Enterer Id",
      "undefinedUpdateUser"      :   "undefined Update  User Id",
      "saveRole"                 :   "Success in saving Role",
      "fetchRoles"                 :   "Success in fetch Roles",
      "deleteRole"                 :   "Success in delete Roles",
      "udpateRole"                 :   "Success in udpate Roles",
      "login"                 :   "Login Success",
      "changePassword"                 :   "Success in change Password",
      "emailVerifiedSuccess"                 :   "email Verified Success",
      "verificationMailSent"                 :   "verification Mail Sent",
      "passwordReset"                 :   "Password reset succfully",
      "saveRole"                 :   "save Role Success",
      "udpateUser"                 :   "udpate User Success",
      "saveCustomer"                 :   "save Customer Success",
      "getCustomer"                 :   "get Customer Success",
      "saveGuestHouse"                 :   "save Guest House Success",
      "updateData"                 :   "update Data Success",
      "deleteData"                 :   "delete Data Success",
      "checkedIn"                 :   "checkedIn success",
      "roomAvailable"                 :   "room is Available",

      //***** Cafirm ***** //
      "saveCafirm"                : "Success in saving Ca Firm",
      "getCafirm"                : "Success in fetch Ca Firm",
    },
  },
  gmailSMTPCredentials : {
      "service"           : "gmail",
      "host"              : "smtp.gmail.com",
      "username"          : "goappsolutions",
      "mailUsername"          : "GOApps",
      "password"          : "Asdf!2341987",
      "verificationMail"  : "goappsolutions@gmail.com"
  },
  mailFormat : {
      "forgotPassword" : {
        "header" : "Forgot Password",
        "content" : "Hello Mr. {{name}} ,\n \t\t please click on the follwing link to reset your password . \n\n {{link}}",
        "link" : config[config["env"]].baseUrl+"/forgotPassword/{{passwordToken}}",
      },
      "signUp" : {
        "subject":"Hello New User !!! ",
        "content" : "Hello Mr. {{name}} ,\n \t\t Thank you for registering to GoApps "
        + "\n Please click on following link to login . \n\n {{link}}",
        "link" : config[config["env"]].baseUrl+"/#/login",
      },

  }
}
module.exports = constants;
