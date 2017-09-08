var db = require('./server/db');
var LOG = require("./server/component/LOG");
var models = require("./server/models/index");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');
//*********************  Role schema  *************//
var roles = [{
    "type": "superAdmin",
    "desc": "superAdmin",
  },
  {
    "type": "client",
    "desc": "client",
  },

]


//************************************* User schema **************************///
var users = {
  superAdmin: {
    //"role":"5994bc801673f817483651c6", // this will be added dynamically
    "username": "superAdmin",
    "password": "superAdmin",
    "email": "superAdmin@yopmail.com",
    "mobile":"1111111111"
  },
  client: {
    //"role":"5994bc801673f817483651c6", // this will be added dynamically
    "username": "client",
    "password": "client",
    "email": "client@yopmail.com",
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
      //callback(null, false);
      models.userModel.remove()
        .then(function(doc) {
          LOG.info("deleted prev data : user");
          models.roleModel.find({
              type: "superAdmin"
            })
            .then(function(role) {
              password(users.superAdmin.password).hash(function(error, hash) {
                users.superAdmin.password = hash;
                users.superAdmin.role = role[0]._id.toString();
                console.log(users.superAdmin);
                return new models.userModel(users.superAdmin).save(function(superAdmin){
                  LOG.info("saved super admin")
                  models.roleModel.find({
                      type: "client"
                    })
                    .then(function(role) {
                      password(users.client.password).hash(function(error, hash) {
                        users.client.password = hash;
                        users.client.role = role[0]._id.toString();
                        console.log(users.client);
                        new models.userModel(users.client).save();
                        callback(null, false);
                      })

                    })
                });
              })
            })
            .catch(function(err) {
              LOG.error("error in saving user admin user", err)
              callback(null, err);
            })

        })
        .then(function(client) {
          callback(null, false)
        })
        .catch(function(err) {
          LOG.error("Error occured ", err);
          callback(null, err);
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
