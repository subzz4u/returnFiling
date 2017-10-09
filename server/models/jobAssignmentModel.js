var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var constants = require("./../../config/constants")
var jobAssignmentSchema = new mongoose.Schema({
    category              : {type: String,required: true},
    assignment              :{type: String,required: true},
    description              :{type: String,required: true},
    role       : {type: Schema.Types.ObjectId, ref: 'role',required: true},
    user          : {type: Schema.Types.ObjectId, ref: 'user',required: true},
    startDate          : {type: Date, default: new Date()},
    endDate            :{type: Date, default:null},
    closeDate          : {type: Date, default:null},

    status            : {type: String,default:"pending"},
    isDelete          : {type: Boolean, default:false},
});
// jobAssignmentSchema.plugin(uniqueValidator, {message: "category already exists"});
var jobAssignmentModel = mongoose.model('jobAssignment', jobAssignmentSchema);
module.exports = jobAssignmentModel;
