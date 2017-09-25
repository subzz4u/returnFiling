var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var userSchema = new mongoose.Schema({
    role              : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    // username          : {type: String, unique : true,required: constants.messages.errors.undefinedUsername},
    email             : {type: String,unique : true,required: constants.messages.errors.emailExist},
    mobile            : {type: String,unique : true,required: constants.messages.errors.mobileExist},
    password          : {type: String,required: constants.messages.errors.undefinedPassword},
    firstname         : {type: String},
    lastname          : {type: String},
    middlename        : {type: String},
    father            :{type: String},
    pan               : {type: String},
    adhar             : {type: String},
    dob               : {type: String},
    telephone         : {type: String},
    plotNo            : {type: String},
    lane              : {type: String},
    at                : {type: String},
    po                : {type: String},
    city              : {type: String},
    dist              : {type: String},
    state             : {type: String},
    country           : {type: String},
    pin               : {type: String},

    // bank details
    bank                : {type: String},
    branch              : {type: String},
    accType             : {type: String},
    accNo               : {type: String},
    ifsc                : {type: String},
    // status
    status            : {type: String,default:"active"},
    isDelete          : {type: Boolean, default:false},


});
userSchema.plugin(uniqueValidator, {message: "Email / Mobile already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
