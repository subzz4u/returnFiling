var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var returnFileSchema = new mongoose.Schema({
    returnFile         : {type: Schema.Types.ObjectId, ref: 'returnFile',required: true},
    referredBy         : {type: Schema.Types.ObjectId, ref: 'user',default:null},
    referralEmail          : {type: String},
    referralMobile          : {type: String},
    // status
    status            : {type: String,enum: constants.returnFileStatus, default:"pending"},
    lastUpdate        :{type:Date , default: new Date()},
    isDelete          : {type: Boolean, default:false},


});
returnFileSchema.plugin(uniqueValidator, {message: "returnFile required"});

var referralModel = mongoose.model('referralModel', returnFileSchema);
module.exports = referralModel;
