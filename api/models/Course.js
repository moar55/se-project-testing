var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  name : {required:true, type:String},
  description: String,
  skill : {required:true, type:String},
  price: String,
  businessName:{required:true,type:String},
  currency: String,
  ratings : [{
    username : String,
    number : Number
  }]
})

CourseSchema.index({_id:1});

var Course = module.exports =  mongoose.model('Course',CourseSchema);
