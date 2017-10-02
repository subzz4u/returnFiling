var db = require('./server/db');
var LOG = require("./server/component/LOG");
var models = require("./server/models/index");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');
//*********************  Role schema  *************//
var roles = [{
    "type": "superAdmin",
    "desc": "super Admin",
  },
  {
    "type": "aa",
    "desc": "Audit & Accounts",
  },
  {
    "type": "consultant",
    "desc": "Consultant",
  },
  {
    "type": "bm",
    "desc": "Business Manager",
  },
  {
    "type": "client",
    "desc": "client",
  },

]


//************************************* User schema **************************///
var users = {
  superAdmin: {
    "password": "asdf!234",
    "email": "superAdmin@yopmail.com",
    "mobile":"1111111111"
  },
  client: {
    "password": "asdf!234",
    "email": "client@yopmail.com",
    "mobile":"2222222222"
  },
  aa: {
    "password": "asdf!234",
    "email": "aa@yopmail.com",
    "mobile":"3333333333"
  },
  consultant: {
    "password": "asdf!234",
    "email": "consultant@yopmail.com",
    "mobile":"4444444444"
  },
  bm: {
    "password": "asdf!234",
    "email": "bm@yopmail.com",
    "mobile":"9999999999"
  },
}
waterfall([
  function(callback) {
    LOG.info("*************  saving Role information ****************");
    models.roleModel.remove()
      .then(function(doc) {
        LOG.info("deleted prev data");
        return models.roleModel.insertMany(roles);
      })
      .then(function(roles) {
        LOG.info("Role seeded ! ");
        callback(null, false);
      })
      .catch(function(err) {
        LOG.error("Error occured in saving role", err);
        callback(null, err);
      })
  },
  function(arg1, callback) { // this will be use for user save
    if (arg1) // error return
      callback(null, arg1);
    else {
      console.log("getting super admin role");
      models.userModel.remove()
        .then(function(doc) {
          return models.roleModel.find({
              type: "superAdmin"
            })
        })
        .then(function(superAdminRole){
          console.log("saving super admin");
          password(users.superAdmin.password).hash(function(error, hash) {
            users.superAdmin.password = hash;
            users.superAdmin.role = superAdminRole[0]._id.toString();
            return new models.userModel(users.superAdmin).save();
          })
        })
        .then(function(doc) {
          console.log("getting client role");
          return models.roleModel.find({
              type: "client"
            })
        })
        .then(function(clientRole){
          console.log("saving client");
          password(users.client.password).hash(function(error, hash) {
            users.client.password = hash;
            users.client.role = clientRole[0]._id.toString();
            return new models.userModel(users.client).save();
          })
        })
        .then(function(doc) {
          console.log("getting aa role");
          return models.roleModel.find({
              type: "aa"
            })
        })
        .then(function(aaRole){
          console.log("saving aa");
          password(users.aa.password).hash(function(error, hash) {
            users.aa.password = hash;
            users.aa.role = aaRole[0]._id.toString();
            return new models.userModel(users.aa).save();
          })
        })
        .then(function(doc) {
          console.log("getting consultant role");
          return models.roleModel.find({
              type: "consultant"
            })
        })
        .then(function(consultantRole){
          console.log("saving consultant");
          password(users.consultant.password).hash(function(error, hash) {
            users.consultant.password = hash;
            users.consultant.role = consultantRole[0]._id.toString();
            return new models.userModel(users.consultant).save();
          })
        })
        .then(function(doc) {
          console.log("getting bm role");
          return models.roleModel.find({
              type: "bm"
            })
        })
        .then(function(bmRole){
          console.log("saving bm");
          password(users.bm.password).hash(function(error, hash) {
            users.bm.password = hash;
            users.bm.role = bmRole[0]._id.toString();
            return new models.userModel(users.bm).save();
          })
        })
        .then(function(doc) {
          LOG.info("*************** END ************");
          callback(null, false);
        })
        .catch(function(error) {
          callback(null, error);
        })


    }
  }
], function(err, result) {
  if (err) {
    LOG.error(err);
  } else
    console.log("Seeding completed !!!!");
    LOG.info("\n\n\n********************************* Please terminate session By CTRL + C *************************");
});
