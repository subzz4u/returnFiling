var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var referFriend = new mongoose.Schema({
    referredBy              : {type: Schema.Types.ObjectId, ref: 'user',required: true},
    email              :{type: String,required:true/*,unique:true*/},
    name              :{type: String,required:true},
    mobile              :{type: String},
    createdDate              :{type: Date,default:new Date()},
    isDelete              :{type: Boolean,default:false},
});
referFriend.plugin(uniqueValidator, {message: "User already exists"});
var referFriendModel = mongoose.model('referFriend', referFriend);
module.exports = referFriendModel;
