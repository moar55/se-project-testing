var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var sproviderSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    firstName: String,
    lastName: String,
    businessName: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    age: Number,
    nationality: String,
    email: {unique:true,type:String},
    acceptance: Number,
    reviews: [{
        username: String,
        text: String,
        stars: Number
    }],
    ssn: Number,
    img: String,
    mobileNumber: String,
    skills: [{
        type: [String]
    }],
    type: {
        type: String,
        default: "ServiceProvider"
    },
    courses:[{type:mongoose.Schema.Types.ObjectId, ref:'Course'}],
    events:[{type:mongoose.Schema.Types.ObjectId, ref:'Event'}],
    braintreeID: String

});

var ServiceProvider = module.exports = mongoose.model('ServiceProvider', sproviderSchema);

module.exports.createsprovider = function(newsprovider, callback) {
    bcrypt.genSalt(10, function(err, salt) {
			if(err) return callback(err)
        bcrypt.hash(newsprovider.password, salt, function(error, hash) {
            if (error) return callback(error)
                newsprovider.password = hash;
                newsprovider.save(callback);
        });
    });
}

module.exports.getSproviderByUsername = function(username, callback,param,errCallback){
	var query = {username: username};
	if(!param)	ServiceProvider.findOne(query, callback);
	else ServiceProvider.findOne(query).select(param).exec().
  then(callback).catch(errCallback);
}

module.exports.getSproviderById = function(id, callback) {
    ServiceProvider.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) callback(err)
        callback(null, isMatch);
    });
}
