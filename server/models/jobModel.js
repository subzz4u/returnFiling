var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var jobSchema = new mongoose.Schema({
    category        : {type: String,unique:true},
    assignment      : {type: [String]},
    createdDate     : {type: Date, default: new Date()},
    isDelete        : {type: Boolean, default:false},
});
jobSchema.plugin(uniqueValidator, {message: "category already exists"});
var jobModel = mongoose.model('jobs', jobSchema);
module.exports = jobModel;
