var express = require('express');
var router = express.Router();
var LocalStrategy = require('passport-local').Strategy;
var ServiceProviders = require('../models/ServiceProvider');
var Students = require("../models/Student");
var Events = require('../models/Event');
var News = require('../models/News');
var path = require('path');
var fs = require('fs');
var Courses = require('../models/Course');
var omit = require('object.omit');
var dbErrCallback = require('../libs/db-err-callback.js');
var braintreeConfig = require('../config/braintree.js');
var braintree = require("braintree");
const nodemailer = require('nodemailer');
var env = require('../config/nodemailer');
var Reset_Token = require('../models/Reset_Token.js');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');



var transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: env.auth.user,
    pass: env.auth.password,
  }
})

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: braintreeConfig.merchantId,
    publicKey: braintreeConfig.publicKey,
    privateKey: braintreeConfig.privateKey
});


module.exports = function(passport) {

    //REGISTRATION
    router.get('/register', function(req, res) {
        res.send('registeration page');
    });

    //Register
    router.post('/register', function(req, res) {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const businessName = req.body.businessName;
        const nationality = req.body.nationality;
        const age = req.body.age;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;
        const acceptance = 0;
        const ssn = req.body.ssn;
        const mobileNumber = req.body.mobileNumber;
        const email = req.body.email;

        req.checkBody('firstName', 'First name is required').notEmpty();
        req.checkBody('lastName', 'Last name is required').notEmpty();
        req.checkBody('businessName', 'Business name is required').notEmpty();
        req.checkBody('nationality', 'Nationality is required').notEmpty();
        req.checkBody('age', 'age is required').notEmpty();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) {
            res.status(409).json({'errors':errors})
        } else {
            var newsprovider = new ServiceProviders({
                firstName: firstName,
                lastName: lastName,
                businessName: businessName,
                nationality: nationality,
                acceptance: acceptance,
                age: age,
                email:email,
                username: username,
                password: password,
                type: 'ServiceProvider',
                ssn: ssn,
                mobileNumber: mobileNumber
            });

            ServiceProviders.createsprovider(newsprovider, function(err, sprovider) {
                if (err) res.status(500).json({
                    error: err.errmsg // Database error,
                })
                else  {
                  var user = {};
                  user.username = newsprovider.username;
                  user.businessName  = newsprovider.businessName;
                  user.fullName = newsprovider.firstName + " " + newsprovider.lastName;
                  user.type= newsprovider.type;
                  user.typr = newsprovider.braintreeID;
                  res.json({success: 'service provider registered ',user:user});

                }

                console.log(sprovider);
            });

        }
    });

    //LOGIN
    //Renders login page
    router.get('/login', function(req, res) {
        res.status(200).json({
            success: true
        })
    });

    //Authenticates login
    router.post('/login',
    function(req, res) {
      passport.authenticate('local-sp',function (err,serviceProvider,info) {
        if(err) res.status(500).send(err);
        else if(!serviceProvider) res.status(401).json({error:info.message});
        else req.logIn(serviceProvider,function (error) {
          if(err) res.status(500).json(err);
          else {
            var user = {};
            console.log(serviceProvider);
            user.username = serviceProvider.username;
            user.businessName  = serviceProvider.businessName;
            user.type= serviceProvider.type;
            user.braintreeID = serviceProvider.braintreeID;
            console.log(user);
            res.json({success: 'service provider logged in ',user:user});
          }
        });
      })(req,res);
    });


    router.post('/forgot-password',function (req, res) {
      if(!req.body.email) return res.status(409).json({error:"Email field can't be empty"});
      else {
        ServiceProviders.findOne({email:req.body.email},function (err, serviceProvider) {
          if(err) return res.status(500).json({err:err.errmsg});
          if(!serviceProvider) res.status(404).json({err:"Service Provider's Email not found!"});
          else{
            Reset_Token.remove({email:req.body.email},function (err) {
            if(!err) console.log('Old tokens removed, hopefully :)');
            var id = mongoose.Types.ObjectId();
            var rt = new Reset_Token({id: id, email:req.body.email,type:'ServiceProvider'});
            rt.save(function (err, response) {
              if(err)return res.status(500).send("Something went wrong")
              else{

                var mailOptions = {
                    from: env.auth.user, // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Password Recovery', // Subject line
                    html: '<b>Dear Service Provider,</b><p>Please click the following link to recover your password: '+req.protocol+"://"+req.hostname+":8080/service-providers/password-reset&id="+id+'</p>' // html body
                };
                transporter.sendMail(mailOptions, function (error, info) {
                  if(error){console.log(error);return res.status(500).send("Something went wrong");}
                  else {
                    res.json({response: "An email has been sent to "+req.body.email})
                  }
                })
              }
            })
          });
        }
        })
      }
    })

    router.get('/password-reset&id=:id',function (req, res) {
        Reset_Token.findOne({'id': req.params.id},function (err, token) {
          if(err) return res.status(500).send();
          if(!token){
           res.status(404).json({err:"no such password reset link"})
         }
         else{
           res.json({success:'true'});
         }
      })
    })

router.post('/password-reset&id=:id',function (req, res) {
      if(!req.body.password) return res.status(409).json({err:"password field can't be empty"});
      if(!req.body.verify_password) return res.status(409).json({err:"verifing password field can't be empty"});
      if(req.body.password!=req.body.verify_password){
         return res.status(409).json({err:"password fields  not showing "})
       }
       Reset_Token.findOne({'id': req.params.id},function (err, token) {
         if(err) return res.status(500).send()
         if(!token){
          res.status(404).json({err:'service_providers_invalid_pass_reset'});
        }
        else if(token){
          ServiceProviders.findOne({'email': token.email},function (error, serviceProvider) {
            if(error){
              res.status(500).send()
            }
            else if(serviceProvider) {

              bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(req.body.password, salt, function(err, hash) {
                      serviceProvider.password = hash;
                      serviceProvider.save(function (err, response) {
                        if(err){
                      return   res.status(500).json(err);
                        console.log('dfdsf');
                      }
                        else {
                           Reset_Token.remove({'id': req.params.id},function (err) {
                             if(!err)console.log('token removed hopefully :)');
                             res.json({success:"true"})
                           })
                        }
                    })
                  });
                })

          }
        })
      }

     })
})
    router.get('/potential',function(req,res){
      if(req.user && req.user.type == 'Admin'){
        ServiceProviders.find({acceptance : 0},function(err,bta3){
          res.json(bta3);
        });
      }else res.send('bas yala');
    });

    //SEARCHING AND VIEWING
   //View all Service Providers
      router.get("/", function(req, res, next) {

     delete req.query['password'];
     var queryConstraints = req.query;

     if(!req.user || (req.user && req.user.type != "Admin"))
     queryConstraints.acceptance = 1;

     ServiceProviders.find(queryConstraints).exec(function(err, serviceProvider) {
       if(err) return res.status(500).json(err.errmsg);
       if(!serviceProvider) res.status(404).json({error:'service provider not found'});
       else res.json(serviceProvider);
     });
   });

   router.get('/courses/:course',function(req,res){
     Courses.find({name : req.params.course},function(err,courses){
       res.json(courses);
     });
   });
   router.get('/courses/id/:id',function(req,res){
     Courses.findOne({_id : req.params.id},function(err,course){
       res.json(course);
     });
   });

    //Search for Service Providers by their business names
    router.get("/:businessName", function(req, res) {
        ServiceProviders.findOne({
            businessName: req.params.businessName
        }).populate('courses events')
        .exec(function(err, serviceProvider) {
            if (err) return res.status(500).json(err.errmsg);  // Database error
            if (!serviceProvider) return res.status(404).json({error:'service provider not found'});
            if (serviceProvider.acceptance || (req.user && req.user.type == "Admin") || (req.user && req.user.type == "ServiceProvider" && serviceProvider.businessName == req.params.businessName)){
                res.status(200).json(serviceProvider);
              }
              else res.status(401).send({status:'unauthorized'});
        });
    });

    router.post("/:username/courses",function (req, res) {
      console.log(';fjdsfk');
      console.log(JSON.stringify(req.body));
      ServiceProviders.findOne({username:req.params.username},function (err, serviceProvider) {
        if(dbErrCallback.find(err,serviceProvider,"ServiceProvider",res)) return;
        console.log(serviceProvider);
        if (err) return res.status(500).json(err.errmsg);
        if(!req.user || req.params.username != req.user.username) return res.status(401).json({err:"unauthorized"});
        if(!serviceProvider.skills.includes(req.body.skill))
           serviceProvider.skills.push(req.body.skill);

        var course = new Courses({
          name: req.body.name,
          description: req.body.description,
          skill: req.body.skill,
          businessName: serviceProvider.businessName,
          price: req.body.price,
          currency: req.body.currency
        });
            if(!serviceProvider.braintreeID){
              console.log('nop');
              var merchantAccountParams = {
                individual: {
                  firstName: serviceProvider.firstName,
                  lastName: serviceProvider.lastName,
                  email: serviceProvider.email,
                  phone: serviceProvider.mobileNumber,
                  dateOfBirth: req.body.dateOfBirth,
                  address: {
                    streetAddress: req.body.streetAddress,
                    locality: req.body.locality,
                    region: req.body.region,
                    postalCode: req.body.postalCode
                  }
                },
                business: {
                  legalName: serviceProvider.businessName,
                  dbaName: serviceProvider.businessName,
                  taxId: "98-7654321",
                  address: {
                    streetAddress: req.body.company_streetAddress,
                    locality: req.body.company_locality,
                    region: req.body.company_region,
                    postalCode: req.body.company_postalCode
                  }
                },
                funding: {
                  destination: "bank",
                  routingNumber:"071101307",
                  accountNumber:"1123581321"
                },
                tosAccepted: true,
                masterMerchantAccountId: '2bornot2b'
              };
              console.log(JSON.stringify(merchantAccountParams ));
            gateway.merchantAccount.create(merchantAccountParams, function (err, result) {
              if(err){ console.log(JSON.stringify(err));res.status(409).json({err:err})}
              else{
                if(result.success){
                  course.save(function (error,course) {
                    if(error) return res.status(500).json({err: error.errmsg});
                    serviceProvider.courses.push(course._id);
                    serviceProvider.braintreeID=result.merchantAccount.id;
                    serviceProvider.save(function (err) {
                      res.json({success:"course added!",id:result.id});
                      console.log("Hooray! course added! "+JSON.stringify(result));
                    })
                  });
              }
              else{
                console.log(JSON.stringify(result));
              }
            }
              })
            }
            else{
              serviceProvider.courses.push(course._id);
              serviceProvider.save(function (err) {

              course.save(function (error,course) {
                if(!error && course)
                res.json({done:"done!"});
              })
            })
          }




      })
    })


    // Accept Service Provider
    router.get('/:username/acceptance',function(req,res){
      console.log(req.user);
      if (req.user && req.user.type == "Admin") {
           ServiceProviders.update({username: req.params.username}, {$set:{acceptance: 1}},function(err) {
             if(err) res.status(500).json(err.errmsg);
             else res.json({success:true});
           });
         }
       else {
           res.status(401).json({error:'unathorized!'});
       }
    });

    //Deletion of service provider
    router.delete('/:username',deleteServiceProvider);
    //Reject a service provider
    router.delete('/:username/reject',deleteServiceProvider);

    function deleteServiceProvider(req,res){
      if (req.user && req.user.type == "Admin") {
          ServiceProviders.getSproviderByUsername(req.params.username, function(err, serviceProvider) {
              if (err) return res.json(500).json({error:err.msg});
              if (!serviceProvider) return res.json({error:'service provider not found'});
              ServiceProviders.remove({
                  'username': req.params.username
              }, function(error) {
                  if (error) return res.status(500).json({errror:error});
                  else res.json({success:req.params.username + ' deleted'});
              });
          });
      }
       else res.status(401).json({err:'unauthorized to delete'});
    }

    //Post events
    router.post('/:username/events', function(req, res) {
      if(!req.user || req.user.username != req.params.username )
        return res.status(401).json({err:'unauthorized'});

      ServiceProviders.findOne({
        username: req.params.username
      },function (err, serviceProvider) {
        var z = new News({
            News: 'An event: '+req.body.event_name+" \nDescription:"+req.body.event_description,
            User: serviceProvider.businessName
        });

        z.save(function(err) {
          if (err) return res.status(500).json(err);

        var e = new Events({
            event_name: req.body.event_name,
            event_description: req.body.event_description,
            event_owner: serviceProvider.businessName,
            date: req.body.date
        });
        e.save(function(err,result) {
            if (err) {
              return res.status(500).json(err);
            }
            serviceProvider.events.push(result._id);
            serviceProvider.save(function (err, result) {
              if (err) {
                 res.status(500).json(err);
              }
              else res.send("Success");
            })
        });
      })
    });
  })

  router.post('/:username/reviews',function (req, res) {
    if(!req.user || req.user.type!="Student") return res.status(401).json({err:"unauthorized"});
    ServiceProviders.findOne({
      username: req.params.username
    }, function (err, serviceProvider) {
      if(dbErrCallback.find(err,serviceProvider,"ServiceProvider",res)) return;
      if(!req.body.text) res.status(409).json({err:"please enter a body for the messaage"});
      serviceProvider.reviews.addToSet({
        username:req.user.username,
        text:req.body.text,
        stars: req.body.stars
      })
      serviceProvider.save(function (err, result) {
        if(err) res.status(500).json(err);
        else  res.json({success:'Success'})
      })
    })
  })

    //SKILLS
    //Add a skill
    router.post("/:username/skills", function(req, res) {
        ServiceProviders.findOne({
            username: req.params.username
        }, function(err, sp) {
            if (err) return res.status(500).json(err.errmsg);
            if (!sp) return res.send({error:'service provider not found'});
            if (req.user && req.user.username == req.params.username && req.user.type == "ServiceProvider") {
                var skill = req.body.skillName;
                if(!sp.skills.includes(skill))
                sp.skills.push(skill);
                else return res.status(500).json({err:'service provider has this skill already'})
                sp.save(function(err) {
                    if (err) {
                        return res.json(err.errmsg);
                    }

                    var n = new News({
                      News: sp.businessName + " added " + skill + " to their skills." ,
                      User: sp.businessName,
                      Type: 1
                    });
                    n.save(function(error) {
                        if (error) {
                            console.log(error);
                        }
                        else return res.json({success:'skill added!'});

                    });
                });
            }
             else res.status(401).json({err:"unauthorized to add skill"});
        });
    });

    router.delete("/:username/skills/:skillName", function(req, res) {
        var skill = req.params.skillName;
        ServiceProviders.findOne({
            username: req.params.username
        }, function(err, serviceProvider) {
            if (err) {
                return res.status(500).json({
                    err: err.errmsg
                });
            }
            if (!serviceProvider) {
                return res.status(404).json({
                    error: 'service provider not found'
                });
            }
            if (req.user && req.user.username == req.params.username && req.user.type == "ServiceProvider") {

                var index = serviceProvider.skills.indexOf(skill);
                if (index >= 0) serviceProvider.skills.splice(index, 1);
                else return res.json({
                    success: "skill doesn't exist"
                })
                serviceProvider.save(function(error) {
                    if (error) {
                        return res.status(500).json({
                            err: error.errmsg
                        });
                    }
                    res.json({
                        success: "skill deleted!"
                    });
                });
            } else res.status(401).json({
                err: "unauthorized to delete interest"
            });
        });
    });



    //EDITING
    //Edit basic info and pic
    router.put("/:username", function(req, res) {
        ServiceProviders.findOne({
            username: req.params.username
        }, function(err, serviceProvider) {
          if (err) return res.status(500).json({error:err.errmsg});
          if (!serviceProvider) return res.status(404).json({error:"wrong username"});
            if (req.user && req.user.username == req.params.username && req.user.type == "ServiceProvider") {
                if (req.files && req.files.length>0){
                  var uploadPath = req.files[0].path;  // TODO: Check for valid extension(s)
                  var savePath = path.resolve('service_providers_photos/'+serviceProvider._id+'_profile.png');
                fs.rename(uploadPath, savePath,function (err) {
                  if(err)
                  return res.status(500).json({error:err});
                  else {
                    serviceProvider.img = savePath;
                    edit(req,res,serviceProvider);
                  }
                });
              }
              else
                  edit(req,res,serviceProvider)
              }
               else res.status(401).json({error:'unathorized to edit'})
          });
      });

      router.post("/:businessName/courses/:course/rating",function(req,res){
        Courses.update({name : req.params.course, businessName : req.params.businessName},
          {$addToSet:{"ratings" : {username : req.user.username, number : req.body.number}}},function(err, serviceProvider){
            res.json({status : "Success!"});
          });
      });


  function edit(req,res,serviceProvider) {
    serviceProvider.email = req.body.email?req.body.email:serviceProvider.email;
    serviceProvider.mobileNumber = req.body.mobileNumber?req.body.mobileNumber:serviceProvider.mobileNumber;
    serviceProvider.nationality = req.body.nationality?req.body.nationality:serviceProvider.nationality;
    serviceProvider.firstName = req.body.firstName?req.body.firstName:serviceProvider.firstName;
    serviceProvider.lastName = req.body.lastName?req.body.lastName:serviceProvider.lastName;
    serviceProvider.age = req.body.age?req.body.age:serviceProvider.age;
    serviceProvider.businessName = req.body.businessName?req.body.businessName:serviceProvider.businessName;
    serviceProvider.mobileNumber = req.body.mobileNumber?req.body.mobileNumber:serviceProvider.mobileNumber;
    serviceProvider.save(function(err) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({success:"Edit success!"});
    });
  }
      return router;
  }
