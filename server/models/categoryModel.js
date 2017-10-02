var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var categorySchema = new mongoose.Schema({
    category              : {type: String,unique:true},
    assignment              :{type: [String]},
    // caFirm:           {type: Schema.Types.ObjectId, ref: 'user',default:null},
    createdDate       : {type: Date, default: new Date()},
    isDelete          : {type: Boolean, default:false},
});
categorySchema.plugin(uniqueValidator, {message: "category already exists"});
var categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;
