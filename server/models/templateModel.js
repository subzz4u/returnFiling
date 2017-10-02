var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var templateSchema = new mongoose.Schema({
    header              : {type: String,unique:true},
    htmlcontent              :{type: String},
    // caFirm:           {type: Schema.Types.ObjectId, ref: 'user',default:null},
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
templateSchema.plugin(uniqueValidator, {message: "Role already exists"});
var templateSchema = mongoose.model('template', templateSchema);
module.exports = templateSchema;
