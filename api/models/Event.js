var mongoose = require('mongoose');

var _Event = mongoose.Schema({
    event_name:{
        type:String,
    },
    event_description:String,
    event_owner:String,
    ID:Number,
    URL:String,
    date: { type: Date, default: Date.now }
})

var events = module.exports = mongoose.model("Event", _Event);

module.exports.getEvents = function(sort,callback){
  if (sort == 0)
	var query = {};
  else
  var query = {Time: -1};
	return events.find(query, callback);
}
