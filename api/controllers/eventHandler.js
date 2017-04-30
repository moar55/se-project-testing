'use strict';

let events = require('../models/Event');

let eventHandler = {

	createEvent:function(req,res){
		events.find(function(err,eventAnnouncment){
			if(err){
				res.send(err.message);
				console.log(err);
			}else{
				res.redirect('/view/events');
			}
		})
	}
}

module.exports = eventHandler;
