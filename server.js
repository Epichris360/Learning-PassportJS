const express  = require('express');
const app      = express();
const port     = 3000//process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const config = require('./config/database.js');

// configuration=================================================================
//mongoose.connect(config.url); // connect our database

// require('./config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies(needed for auth)
//app.use(bodyParser()); // get information from html forms

app.set('view engine','ejs'); // setup ejs for templating

// required for passport
//app.use(session({secret: "thisissecret"}));; // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes =======================================================================
require('./app/routes.js')(app, passport);
// ^-- load our routes and pass in our app and fully configured passport

// Launch =======================================================================
app.listen(port);
console.log('the magic happens on port: '+port);
