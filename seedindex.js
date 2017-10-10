var db = require('./server/db');
var LOG = require("./server/component/LOG");
var models = require("./server/models/index");
var waterfall = require('async-waterfall');
var password = require('password-hash-and-salt');

var seedCollection = {
  emailTemplate: {
    add: true,
    data: [{
        "type":"new_user",
        "header": "Welcome ! user",
        "htmlcontent": "",
      },
      {
        "type":"forgot_password",
        "header": "forgot password",
        "htmlcontent": "",
      }
    ],
  }
}

// saving email
if(seedCollection.emailTemplate.add){
  models.templateModel.remove()
    .then(function(doc) {
      LOG.info("deleted prev data");
      return models.templateModel.insertMany(seedCollection.emailTemplate.data);
    })
    .then(function(template) {
      LOG.info("template seeded ! ");
    })
    .catch(function(err) {
      LOG.error("Error occured in saving template", err);
    })
}
