const LocalStrategy = require('passport-local').Strategy;
const Students = require('../models/Student');
const ServiceProviders = require('../models/ServiceProvider');
const Admins = require('../models/Admin');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        var key = {
            id: user._id,
            type: user.type
        }
        done(null, key);
    });

    // used to deserialize the user
    passport.deserializeUser(function(key, done) {
        var Model;
        if (key.type == 'Student') Model = Students;
        else if (key.type == 'ServiceProvider') Model = ServiceProviders;
        else Model = Admins;
        Model.findById(key.id, function(err, user) {
            console.log(user);
            done(err, user);
        });
    });

    passport.use('local-student', new LocalStrategy(function(username, password, done) {
        Students.getStudentByUsername(username, function(student) {
            if (!student) return done(null, false, {
                message: 'Invalid username or password'
            });
            Students.comparePassword(password, student.password, function(error, isMatch) {
                if (error)  done(error);
                else if (!isMatch)
                             done(null, false, {
                                message: 'Invalid username or password'
                            });
                else  done(null, student);
            });
        },'username password type',function (err) {
          return done(err);
        });
        }));

    passport.use('local-sp', new LocalStrategy(function(username, password, done) {
        ServiceProviders.getSproviderByUsername(username, function(sprovider) {
          console.log(sprovider);
            if (!sprovider) {
                return done(null, false, {
                    message: 'Invalid username or password'
                });
            }
            ServiceProviders.comparePassword(password, sprovider.password, function(error, isMatch) {
                if (error) return  done(error);
                if (!isMatch)
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                else if (sprovider.acceptance)
                    return done(null, sprovider);
                else
                    return done(null, false, {
                        message: 'Service Provider not accpeted yet.'
                    });
                  })
            },'username businessName password type acceptance braintreeID',function (err) {
      return done(err);
        })
    }));

    passport.use('local-admin', new LocalStrategy(function(username, password, done) {
        Admins.getAdmin(username, function(admin) {
          console.log(admin);
            if (!admin) return done(null, false, {
                message: 'Invalid username or password'
            });
            Admins.comparePassword(password, admin.salt, admin.password, function(error, isMatch) {
                if (error)  done(null,false,{message: 'Invalid username or password'});
                else if (!isMatch)
                            return done(null, false, {
                                message: 'Invalid username or password'
                            });
                else
                     done(null, admin);
            });
        },'username password salt type',function (err) {
          return done(err);
        });
    }));
}
