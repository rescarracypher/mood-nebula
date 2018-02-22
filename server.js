 // *** Dependencies ***
// =============================================================

// Requiring necessary npm packages
var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');
// var flash = require('express-flash');
var crypto = require('crypto');
var async = require('async');
require('dotenv').load();


// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 8000;
var db = require("./models");

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
// require("./routes/user-api-routes.js")(app);
// function request(req, res) {
//     var store = '';

//     request.on('data', function(data) 
//     {
//         store += data;
//     });
//     request.on('end', function() 
//     {  console.log(store);
//         response.setHeader("Content-Type", "text/json");
//         response.setHeader("Access-Control-Allow-Origin", "*");
//         response.end(store)
//     });
//  } 

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
