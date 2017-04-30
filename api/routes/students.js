var express = require('express');
var router = express.Router();
var Students = require("../models/Student");
var ServiceProviders = require("../models/ServiceProvider");
var Events = require("../models/Event");
var News = require("../models/News");
var Courses = require('../models/Course');
var path = require('path');
var fs = require('fs');
// var twoCheckConf = require('../config/two-checkout');
// var TwoCheckout = require('2checkout-node');
var Payments = require('../models/Payment');
var async = require('async');
var dbErrCallback = require('../libs/db-err-callback.js');
var mongoose = require('mongoose');
var braintreeConfig = require('../config/braintree.js');
var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: braintreeConfig.merchantId,
    publicKey: braintreeConfig.publicKey,
    privateKey: braintreeConfig.privateKey
});

const nodemailer = require('nodemailer');
var env = require('../config/nodemailer');
var Reset_Token = require('../models/Reset_Token.js');
var bcrypt = require('bcryptjs');

var transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: env.auth.user,
    pass: env.auth.password,
  }
})



module.exports = function(passport) {

    //REGISTRATION
    //???
    router.get('/register', function(req, res) {
        res.send('student register');
    });

    //Student Registering
    router.post('/register', function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;
        const email = req.body.email;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const school = req.body.school;
        const nationality = req.body.nationality;
        const age = req.body.age;
        const mobileNumber = req.body.mobileNumber;

        req.checkBody('firstName', 'First name is required').notEmpty();
        req.checkBody('lastName', 'Last name is required').notEmpty();
        req.checkBody('school', 'School name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('nationality', 'Nationality is required').notEmpty();
        req.checkBody('age', 'age is required').notEmpty();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) {
            console.log(errors);
            res.status(408).json(errors);
        } else {
            var newStudent = new Students({
                firstName: firstName,
                lastName: lastName,
                nationality: nationality,
                age: age,
                email: email,
                username: username,
                password: password,
                school: school,
                type: 'Student',
                mobileNumber: mobileNumber
            });
            Students.createStudent(newStudent, function(err, student) {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        error: err.errmsg
                    });
                } else {
                  var user = {};
                  user.username = student.username;
                  user.type = student.type;
                  res.json({
                      success: 'student registered ',
                      user: user
                  });
              }
            });
        }
    });

    //LOGIN
    //Authenticates Login
    router.post('/login', function(req, res) {
        passport.authenticate('local-student', function(err, student, info) {
            if (err) res.status(500).send(err);
            else if (!student) {
                res.status(401).json({
                    error: info.message
                });
                console.log("not a student");
                console.log(req.body);
            } else req.logIn(student, function(error) {
                if (err) res.status(500).json(err);
                else {
                    console.log('the student ' + JSON.stringify(student));
                    var user = {};
                    user.username = student.username;
                    user.type = student.type;
                    res.json({
                        success: 'student logged in ',
                        user: user
                    });
                }
            });
        })(req, res);
    });



    router.post('/forgot-password',function (req, res) {
      if(!req.body.email) return res.status(409).json({error:"Email field can't be empty"});
      else {
        Students.findOne({email:req.body.email},function (err, student) {
          if(err) return res.status(500).json({err:err.errmsg});
          if(!student) res.status(404).json({err:"Student Email not found!"});
          else{
            Reset_Token.remove({email:req.body.email},function (err) {
            if(!err) console.log('Old tokens removed, hopefully :)');
            var id = mongoose.Types.ObjectId();
            var rt = new Reset_Token({id: id, email:req.body.email,type:'Student'});
            rt.save(function (err, response) {
              if(err)return res.status(500).send("Something went wrong")
              else{

                var mailOptions = {
                    from: env.auth.user, // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Password Recovery', // Subject line
                    html: '<b>Dear Student,</b><p>Please click the following link to recover your password: '+req.protocol+"://"+req.hostname+":8080/students/password-reset&id="+id+'</p>' // html body
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
          res.status(404).json({err:'students_invalid_pass_reset'});
        }
        else if(token){
          Students.findOne({'email': token.email},function (error, student) {
            if(error){
              res.status(500).send()
            }
            else if(student) {

              bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(req.body.password, salt, function(err, hash) {
                      student.password = hash;
                      student.save(function (err, response) {
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

    //SEARCHING
    //View all students as well as searching.
    router.get("/", function(req, res, next) { //
        var queryConstraints = {};
        /* If there are values in the query url should be something like this
                                        sitename/api/students?firstName=name&lastName=name...etc This is used to implement the search */

        delete req.query['password'] // Not sure if this gives any further security, but this line here actually works! :D

        for (var i in req.query)
            queryConstraints[i] = req.query[i];

        Students.find(queryConstraints).exec(function(err, stuff) {
            res.json(stuff);
        });
    });




    //EVENTS
    //Gets events from DB
    router.get('/event', function(req, res) {
        Events.find({}).exec(function(err, x) {
            res.send(x);
        });
    });

    //Gets events from DB and sorts them based on Time
    router.get('/sortevent', function(req, res) {
        Events.find({}).sort({
            date: -1
        }).exec(function(err, x) {
            res.send(x);
        });
    });



    //NEWS
    //Load news from db, News is auto generated when a service providers adds a skill or posts an event himself.
    router.get('/news', function(req, res) {
        if (!req.user) {
            res.send("You are not logged in");
            return;
        }
        var news = [];

        Students.findOne({
                username: req.user.username
            })
            .populate('courses').exec(function(err, student) {
              if(dbErrCallback.find(err,student,"Student",res)) return;

                ServiceProviders.find({}).populate('courses').exec(function(err, serviceProviders) {
                  if(dbErrCallback.find(err,serviceProviders,"ServiceProvider",res)) return;
                    console.log(serviceProviders);
                    if (!serviceProviders)
                        return res.status(500).json({
                            err: "nooo"
                        });
                    var asyncTasks = [];
                    student.courses.forEach(function(course) {
                        asyncTasks.push(function(callback) {

                            var spBusinessName = findSPGivingCourse(serviceProviders, course);
                            console.log(spBusinessName);
                            //console.log(y.providedby);
                            News.find({
                                User: spBusinessName
                            }).sort({
                                Date: -1
                            }).exec(function(err, coursenews) {
                                //console.log("Pushed " +  x);
                                if(coursenews)
                                news.push(coursenews);
                                callback();
                            });
                        });
                    });

                    student.follows.forEach(function(follow) {
                        asyncTasks.push(function(callback) {

                            console.log(follow.name);
                            News.find({
                                User: follow.name
                            }).sort({
                                Date: -1
                            }).exec(function(err, followernews) {
                              if(followernews)
                                news.push(followernews);
                                callback();
                            })
                        })
                    });

                    async.parallel(asyncTasks, function() {
                      if(news.length)
                      news = news.reduce(function (a,b) {
                        return a.concat(b);
                      });
                      if (news.length == 0 )
                      {
                        news.push({News: "Welcome to our website", Date: Date.now(),User:"Administration", type:1 });
                      }
                        res.json({
                            news: news
                        });
                    })
                })
            })
    });

    function findSPGivingCourse(serviceProviders, queryCourse) {
        console.log(' da query boy ' + queryCourse._id);

        for (var serviceProvider of serviceProviders) {
            for (var course of serviceProvider.courses) {
                console.log(course._id);
                if (String(queryCourse._id) === String(course._id)) {
                    console.log("duuude");
                    return serviceProvider.businessName;
                }
            }
        }
    }

    router.post("/:username/follow", function(req, res) {

        var type = req.body.typeOf;
        var user = req.body.user;

        Students.findOne({
            username: req.user.username
        }, function(err, student) {
            if (err) {
                return res.status(500).json({
                    err: err.errmsg
                });
            }
            if (!student) {
                return res.status(404).json({
                    error: 'student not found'
                });
            }
            if (req.user && req.body.typeOf && req.params.username) {
                student.follows.push({ // TODO: check if not already added
                    name: user,
                    typeOf: String(type)
                });
                student.save(function(error) {
                    if (error) {
                        return res.status(500).json({
                            err: error
                        });
                    }
                    var n = new News({
                        News: student.username + " Started following " + req.body.user,
                        User: req.user.username,
                        Type: 0
                    });
                    n.save(function(error) {
                        if (error) {
                            console.log(error);
                        }
                    });
                    res.json({
                        success: 'Added to followers!'
                    });
                });
            } else res.status(401).json({
                err: "unauthorized"
            });
        });
    });


    router.post("/:username/courses", function(req, res) {
      console.log('yooo '+JSON.stringify(req.body));
        var course = req.body.course;
        console.log(course);
        if (req.user && req.user.username == req.params.username) {

            Students.findOne({
                username: req.user.username
            }, function(err, student) {
                if (err) {
                  console.log('ooop '+err);
                    return res.status(500).json({
                        err: err
                    });
                }

                if (!student) {
                    return res.status(404).json({
                        error: 'student not found'
                    });
                }

                Courses.findOne({
                    _id: course
                }, function(error, course) {
                    if (error) {console.log('doh!');return res.status(500).json({
                        error: error.errmsg
                    })
                  }
                    if (!course) return res.status(404).json({
                        error: "Course not found"
                    });

                    else console.log('woawefjk');
                    console.log('the course man '+course);

                    ServiceProviders.findOne({businessName:course.businessName},function (err, serviceProvider) {
                      if(dbErrCallback.find(err,serviceProvider,"ServiceProvider",res)) return;
                      gateway.transaction.sale({
                        merchantAccountId: serviceProvider.braintreeID,
                          amount: course.price,
                          paymentMethodNonce: req.body.payment_method_nonce,
                          serviceFeeAmount: course.price*0.15
                      }, function(err, result) {
                        console.log(err + " "+result+" that thing");
                        if(!err && result){
                        console.log('hmm money');
                        console.log('the money is here boy ' + JSON.stringify(result));
                        var n = new News({
                            News: req.user.username + "Joined a new course " + course,
                            User: req.user.username,
                            Type: 0
                        });
                        n.save(function(error) {
                            if (error) {
                                console.log(error);
                            }
                        });

                        student.courses.push(course._id);

                        student.save(function(error) {
                            if (error) return res.status(500).json({
                                err: error.errmsg
                            });
                        })
                      }
                      else {res.status(500).json({err:err})};
                      });
                    })
                })

            })

        } else
            res.status(401).json({
                error: "unauthorized"
            });
    });

  //INTERESTS
    // Add an interestTag
    router.post("/:username/interests", function(req, res) {
        var interest = req.body.interestName;
        Students.findOne({
            username: req.params.username
        }, function(err, student) {
            if (err) {
                return res.status(500).json({
                    err: err.errmsg
                });
            }
            if (!student) {
                return res.status(404).json({
                    error: 'student not found'
                });
            }
            if (req.user && req.user.username == req.params.username && req.user.type == "Student") {
                student.interestTags.push(interest);
                student.save(function(error) {
                    if (error) {
                        return res.status(500).json({
                            err: error.errmsg
                        });
                    }
                    res.json({
                        success: 'interest added!'
                    });
                });
            } else res.status(401).json({
                err: "unauthorized to add interest"
            });
        });
    });

    // delete an interestTag
    router.delete("/:username/interests/:interestName", function(req, res) {
        var interest = req.params.interestName;
        Students.findOne({
            username: req.params.username
        }, function(err, student) {
            if (err) {
                return res.status(500).json({
                    err: err.errmsg
                });
            }
            if (!student) {
                return res.status(404).json({
                    error: 'student not found'
                });
            }
            if (req.user && req.user.username == req.params.username && req.user.type == "Student") {

                var index = student.interestTags.indexOf(interest);
                if (index >= 0) student.interestTags.splice(index, 1);
                else return res.json({
                    success: "Interest doesn't exist"
                })
                student.save(function(error) {
                    if (error) {
                        return res.status(500).json({
                            err: error.errmsg
                        });
                    }
                    res.json({
                        success: "interest deleted!"
                    });
                });
            } else res.status(401).json({
                err: "unauthorized to delete interest"
            });
        });
    });

    router.get('/:username', function(req, res) {
        Students.findOne({
            username: req.params.username
        }).populate('courses').exec(function(err, student) {
            if (err) return res.status(500).json(err.errmsg); // Database error
            if (!student) return res.status(404).json({
                error: 'student not found'
            });
            else res.status(200).json(student);
        });
    })

  // Edit students basic info and picture
  router.put("/:username",function(req, res) {
   Students.findOne({
     username: req.params.username
   },function(err, student) {
     if (err) return res.status(500).json({error:err.errmsg});
     if (!student) return res.status(404).json({error:"wrong username or password"});
       if (req.user && req.user.username == req.params.username && req.user.type == "Student") {
           if (req.files && req.files.length>0){
             var uploadPath = req.files[0].path;  // TODO: Check for valid extension(s)
             var savePath = path.resolve('students_photos/'+student._id+'_profile.png');
           fs.rename(uploadPath, savePath,function (err) {
             if(err)
             return res.status(500).json({error:err});
             else {
               student.img = savePath;
               edit(req,res,student);
             }
           });
         }
         else
             edit(req,res,student)
         }
          else res.status(401).json({error:'unathorized to edit'})
     });
 });

 function edit(req,res,student) {
   student.email = req.body.email?req.body.email:student.email;
   student.firstName = req.body.firstName?req.body.firstName:student.firstName;
   student.lastName = req.body.lastName?req.body.lastName:student.lastName;
   student.age = req.body.age?req.body.age:student.age;
   student.school = req.body.school?req.body.school:student.school;
   student.mobileNumber = req.body.mobileNumber?req.body.mobileNumber:student.mobileNumber;
   student.nationality = req.body.nationality?req.body.nationality:student.nationality;
   student.save(function(err) {
       if (err) {
         console.log(err);
         return res.status(500).json(err);
       }
       res.json({success:"Edit success!"});
   });
 }

    //Deletion
    router.delete('/:username', function(req, res) {
        if (req.user && req.user.type == "Admin") {
            Students.getStudentByUsername(req.params.username, function(err, student) {
                if (err) return res.status(500).json({
                    err: err.errmsg
                });
                if (!student) return res.status(500).json({
                    err: 'student not found'
                });
                Students.remove({
                    'username': req.params.username
                }, function(error) {
                    if (error) return res.status(500).json({
                        err: error.errmsg
                    });
                    else res.json({
                        success: 'student deleted'
                    });
                });
            });
        } else res.status(401).json({
            err: 'unauthorized to delete student'
        });
    });

    return router;
}
