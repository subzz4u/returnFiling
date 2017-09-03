var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var constants = require('./../../config/constants');
var validator = require('validator');
var Schema = mongoose.Schema;
var returnFileSchema = new mongoose.Schema({
    client              : {type: Schema.Types.ObjectId, ref: 'user',required: true},
    itrId          : {type: String, unique : true,required: constants.messages.errors.itrIdUnique},
    // income details
    conEmpInc       :{type:Number,default:null},
    rentalInc       :{type:Number,default:null},
    fixDepositInc       :{type:Number,default:null},
    businessInc       :{type:Number,default:null},
    houseLoanInterestInc       :{type:Number,default:null},
    savingAcInc       :{type:Number,default:null},
    capitalGainInc       :{type:Number,default:null},
    otherInc       :{type:Number,default:null},

    // expendse details 80C
    lip80C  :{type:Number,default:null},
    pff80C  :{type:Number,default:null},
    pf80C  :{type:Number,default:null},
    tutionFees80C  :{type:Number,default:null},
    mf80C  :{type:Number,default:null},
    senCitizec80C  :{type:Number,default:null},
    fd80C  :{type:Number,default:null},
    uip80C  :{type:Number,default:null},
    ssy80C  :{type:Number,default:null},
    prh80C  :{type:Number,default:null},
    nps80C  :{type:Number,default:null},
    nsc80C  :{type:Number,default:null},

    nps80CCD  :{type:Number,default:null},
    eduLoan80E  :{type:Number,default:null},
    Mediclaim80D  :{type:Number,default:null},
    saving80TTA  :{type:Number,default:null},

    fiscalYear  :{type: String,required:constants.messages.errors.fiscalYearRequired},

    //payment information


    // status
    status            : {type: String,enum: constants.returnFileStatus, default:"pending"},
    lastUpdate        :{type:Date , default: new Date()},
    isDelete          : {type: Boolean, default:false},


});
returnFileSchema.plugin(uniqueValidator, {message: "ITR already exist"});

var returnFileModel = mongoose.model('returnFile', returnFileSchema);
module.exports = returnFileModel;
