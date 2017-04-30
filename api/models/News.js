var mongoose = require('mongoose');


var newschema = new mongoose.Schema({
    News: String,
    Date: { type: Date, default: Date.now },
    User: String,
    Type: { type: Number, min:0,max:1 }
});
var News = module.exports = mongoose.model('News',newschema);
