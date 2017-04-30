var express = require('express');
var session = require('express-session');
var expressValidator = require('express-validator');
var multer = require('multer');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/campus');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var passport = require('passport');
var session = require('express-session');

//BodyParse MiddleWare
app.use(multer({dest: 'uploads/'}).array('files'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'50mb',extended: true}));
app.use(cookieParser());
app.use(session({secret: 'Secret1337'}));

app.use(express.static(__dirname+'/client',{maxAge:0}));
app.set('view engine', 'html');

// Passport settings
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('flash');
	res.locals.user = req.user || null;
	next();
});


require('./api/config/passport')(passport);

var students = require('./api/routes/students')(passport);
var serviceProviders = require('./api/routes/serviceProviders')(passport);
var admins = require('./api/routes/admins')(passport);
var index = require('./api/routes/index.js')(passport);

app.use(function(req,res,next){
	res.locals.errors = null;
	next();
});

//Static folder


//expressValidator MiddleWare
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use('/api/students',students);
app.use('/api/service-providers',serviceProviders);
app.use('/api/admins',admins);
app.use('/', index);


app.get('/api/logout',function (req, res) {
	if(!req.user) return res.json({succes:"not logged in aslan lol"})
	req.logout();
	if(!req.user)
	res.json({succes:'logged out!'});
})


// start the server
app.listen(8080, function(){
    console.log("server is listening on port 8080");
})
