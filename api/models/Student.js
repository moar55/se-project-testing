var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var StudentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    school: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    age: Number,
    nationality: String,
    email: {unique:true,type:String},
    img: String,
    interestTags: [String],
    type: {
        type: String,
        default: "Student"
    },
    follows: [{
        name: String,
        typeOf: String
    }],
    mobileNumber: {
        type: String
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

StudentSchema.index({
    _id: 1,
    username: 1
});


var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.createStudent = function(newStudent, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newStudent.password, salt, function(err, hash) {
            newStudent.password = hash;
            newStudent.save(callback);
        });
    });
}

module.exports.getStudentByUsername = function(username, callback, param, errCallback) {
    var query = {
        username: username
    };
    if (!param) Student.findOne(query, callback);
    else Student.findOne(query).select(param).exec().
    then(callback).catch(errCallback);

}

module.exports.getStudentById = function(id, callback) {
    Student.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) callback(err, false);
        callback(null, isMatch);
    });
}
