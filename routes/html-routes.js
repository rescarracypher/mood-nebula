// Requiring path to so we can use relative routes to our HTML files
var path = require("path");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = function(app) {
  //-------------------------------------------------------------------------
  //route for landing page
  //-------------------------------------------------------------------------
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  //-------------------------------------------------------------------------
  //route for sign up
  //-------------------------------------------------------------------------
   app.get("/signup", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
   //------------------------------------------------------------------------
   //route for login
   //------------------------------------------------------------------------
  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });
  //--------------------------------------------------------------------------
  //route for memebers
  //--------------------------------------------------------------------------
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members/members.html"));
  });
  //--------------------------------------------------------------------------
  //internal routes after authentication
  //--------------------------------------------------------------------------
  app.get("/memos", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/memos/memos.html"));
  });
 
  app.get("/missions", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/missions/missions.html"));
  });
    app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/about/about.html"));
  });
    app.get("/moodmap", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/moodmap/moodmap.html"));
  });
    app.get("/meditate", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/meditation/meditation.html"));
  });
  //--------------------------------------------------------------------------
  //route for fogot password
  //--------------------------------------------------------------------------
  app.get("/forgot", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/forgot.html"));
  });
  //---------------------------------------------------------------------------
  //response route for password email being sent
  //---------------------------------------------------------------------------
  app.get("/forgotMessage", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/forgotMessage.html"));
  });
  //---------------------------------------------------------------------------
  //route linking forgot password email to password reset
  //---------------------------------------------------------------------------
  app.get("/reset/:token", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/reset.html"));
  });
};