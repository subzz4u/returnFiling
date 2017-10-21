var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var jobSchema = new mongoose.Schema({
	workName		: {type: String,required: constants.messages.errors.undefinedTaskName},
    category        : {type: String,unique:true},
    assignment      : {type: [String]},
    description     : {type: String,required: true},
    client			: {type: Schema.Types.ObjectId, ref: 'user',default:null},
    createdDate     : {type: Date, default: new Date()},
    isDelete        : {type: Boolean, default:false},
});
jobSchema.plugin(uniqueValidator, {message: "category already exists"});
var jobModel = mongoose.model('jobs', jobSchema);
module.exports = jobModel;
