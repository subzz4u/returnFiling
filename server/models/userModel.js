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
    id                : {type: String},
    designation       : {type: String},
    pan               : {type: String},
    mobile            : {type: String},
    at                : {type: String},
    po                : {type: String},
    city              : {type: String},
    dist              : {type: String},
    state             : {type: String},
    country           : {type: String},
    pin               : {type: String},
    status            : {type: String},
    isDelete          : {type: Boolean, default:false},

    //******************* CA FIRM details *****************//
    caFirm            :{type: Schema.Types.ObjectId, ref: 'caFirm'},

    //********************* Company/vendor ***************//
    company            :{type: Schema.Types.ObjectId, ref: 'company'},

});
userSchema.plugin(uniqueValidator, {message: "Username already exists"});

var userModel = mongoose.model('user', userSchema);
module.exports = userModel;
