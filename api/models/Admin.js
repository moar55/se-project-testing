const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcryptjs');
const passHash = require('../libs/pass-hashing');

var Admin = new Schema({
    username: {type : String, required : true,unique : true},
    password: {type : String, required : true, select: false},
    email: {type : String, unique : true},
    type: {type: String, default: "Admin"},
    salt: String
});
var Admin = module.exports = mongoose.model('Admin', Admin);

module.exports.getAdmin = function(username, callback,param,errCallback){
	var query = {username: username};
  if(!param)
	Admin.findOne(query, callback);
  else Admin.findOne(query).select(param).exec().
  then(callback).catch(errCallback);
}

module.exports.comparePassword = function(candidatePassword, salt,hash, callback){
	if(passHash.saltHashPassword(candidatePassword, salt) == hash){
     callback(null,true)
  }
  else{
      console.log('nop!');
       callback('password not matching',false);
    }
}
