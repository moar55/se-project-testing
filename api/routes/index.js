var express = require('express');
var router = express.Router();
var eventHandler = require('../controllers/eventHandler');
var path = require('path');
const ServiceProviders = require('../models/ServiceProvider.js');
const Students = require('../models/Student.js');
var dbErrCallback = require('../libs/db-err-callback.js');
var braintreeConfig = require('../config/braintree.js');

var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: braintreeConfig.merchantId,
    publicKey: braintreeConfig.publicKey,
    privateKey: braintreeConfig.privateKey
});


/* GET home page. */
module.exports = function(passport) {

    router.get('/', function(req, res, next) {
        res.sendFile(path.resolve("./client/views/main.html"));
    });


    router.get('/:val*', function(req, res, next) {
        if (req.params.val != 'api')
            res.sendFile(path.resolve("./client/views/main.html"));
        else {
            next();
        }
    });

    router.get('/api/client-token', function(req, res) {
        gateway.clientToken.generate({}, function(er, response) {
          if(er) return res.status(500).json({err:er});
          res.json({token: response.clientToken});
        })
    })

    router.get('/api/suggestions', function(req, res) {
        if (req.user && req.user.type == "Student") {
            var serviceProviders = [];
            Students.findOne({
                username: req.user.username
            }, function(err, student) {
                if (dbErrCallback.find(err, student, "Student", res)) return;
                ServiceProviders.find({}, function(err, serviceProviderz) {
                    serviceProviderz.forEach(function(serviceProvider) {
                        serviceProvider.skills.forEach(function(skill) {
                            if (skill) {
                                if (dbErrCallback.find(err, serviceProviderz, "ServiceProvider", res)) return;
                                if (student.interestTags.includes(skill) && !serviceProviders.includes(serviceProvider)) {
                                    serviceProviders.push(serviceProvider)
                                }
                            }
                        });
                    })
                    res.json({
                        results: serviceProviders
                    });
                })
            })
        } else {
            res.status(401).json({
                err: "unathorized"
            });
        }
    })


    // router.get('/status',function(req,res){
    //   console.log('yo boyys');
    //   var info;
    //   if(req.user){
    //   switch(req.user.type){
    //     case 'Admin' : info = {username : req.user.username, type : 'Admin'};break;
    //     case 'Student' : info = {username : req.user.username, type : 'Student', firstName : req.user.firstName, lastName : req.user.lastName};break;
    //     case 'ServiceProvider' : info = {username : req.user.username, type : 'ServiceProvider', businessName : req.user.businessName};break;
    //   }
    //   res.json(info);
    // }
    // else {
    //   res.status(401).json({response:"no user logged in"});
    // }
    // });


    return router;
}
