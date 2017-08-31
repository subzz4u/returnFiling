var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var password = require('password-hash-and-salt');
var userSchema = new mongoose.Schema({
    role              : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    username          : {type: String, unique : true,required: constants.messages.errors.undefinedUsername},
    password          : {type: String,required: constants.messages.errors.undefinedPassword},
    email             : {type: String},
    firstname         : {type: String},
    lastname          : {type: String},
    middlename        : {type: String},
    father            :{type: String},
    pan               : {type: String},
    adhar               : {type: String},
    mobile            : {type: String},
    plotNo            : {type: String},
    lane            : {type: String},
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
    accType              : {type: String},
    accNo             : {type: String},
    ifsc           : {type: String},
    // status
    status            : {type: String},
    isDelete          : {type: Boolean, default:false},


});
userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
