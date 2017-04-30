const express = require('express');
const router = express.Router();
const passport = require('passport');
const Admins = require('../models/Admin');
const Events = require('../models/Event');
const ServiceProviders = require("../models/ServiceProvider");
const omit = require('object.omit');


module.exports = function(passport) {

    router.get('/login', function(req, res) {
        res.json({response:'admin login screen'});
    });

    router.post('/login', function(req, res) {
      passport.authenticate('local-admin',function (err,admin,info) {
        if(err) res.status(500).json(err);
        else if(!admin) res.status(401).json({error:info.message});
        else req.logIn(admin,function (error) {
          if(err) res.status(500).json(err);
          else {
            var user = {};
            user.username = admin.username;
            user.type = admin.type;
            res.json({success: 'admin logged in ',user:user});
          }
        });
      })(req,res);
    });



    router.get("/events", function(req, res, next) {
        if (req.user && req.user.type == "Admin") {
            events.find().exec(function(err, stuff) {
                res.send(stuff);
            });
        } else {
            res.send('unauthorized');
        }
    });

    return router;
}
