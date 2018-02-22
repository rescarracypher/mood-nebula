 // Requiring our models and passport as we've configured it
 var db = require("../models");
 var passport = require("../config/passport");
 var async = require('async');
 var crypto = require('crypto');
 var nodemailer = require('nodemailer');
 var flash = require('express-flash');
 var bcrypt = require("bcrypt-nodejs");
 var config = require('../config/config.json');
 module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authorized
    res.json("/members");
  });
  
  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  // Route for signup
  // ==========================================================
  app.post("/api/signup", function(req, res) {
    db.User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  });
  // Route for logging user out
  // ==========================================================
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
      console.log(res.json({}));
    } else {
      // Otherwise send back the user's username and id
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });
  // Routes for emotions,
  // ==========================================================
  app.get("/api/emotions", function(req, res) {
    db.Emotion.findAll({
      where: {
        UserId: req.query.user_id
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json(err);
    });
  });
  app.post("/api/emotions", function(req, res) {
    db.Emotion.create({
      Emotion: req.body.emotion,
      Color: req.body.color,
      Emotion_Date: req.body.emotion_date,
      UserId: req.body.user_id,
      Positive_Emotion: req.body.positive_emotion
    }).then(function(data) {
      res.json(data);
    });
  });
  // Routes for missions
  // ==========================================================
  app.get("/api/missions", function(req, res) {
    db.Mission.findAll({
      where: {
        UserId: req.query.user_id
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json(err);
    });
  });

  app.post("/api/missions", function(req, res) {
    db.Mission.create({
      Mission_id: req.body.mission_id,
      Mission_Result: req.body.mission_result,
      Mission_Date: req.body.mission_date,
      UserId: req.body.user_id
    }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/missions_by_day", function(req, res) {
    db.Mission.findAll({
      where: {
        UserId: req.query.user_id,
        Mission_Date: req.query.mission_date
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json(err);
    });
  });

  app.get("/api/active_missions", function(req, res) {
    db.Active_Mission.findAll({
      where: {
        UserId: req.query.user_id
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json(err);
    });
  });
  app.post("/api/active_missions", function(req, res) {
    db.Active_Mission.create({
      Mission_id: req.body.mission_id,
      Activation_Date: req.body.activation_date,
      UserId: req.body.user_id
    }).then(function(data) {
      res.json(data);
    });
  });
  app.post("/api/active_mission_remove", function(req, res) {
    db.Active_Mission.destroy({
      where: {
        Mission_id: req.body.mission_id,
        UserId: req.body.user_id
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  // DELETE FROM post WHERE status = 'inactive';


  // Routes for memo
  // ==========================================================
  app.get("/api/memos", function(req, res) {
    db.Memo.findAll({
      where: {
        UserId: req.query.user_id
      }
    }).then(function(data) {
      res.json(data);
    }).catch(function(err) {
      res.json(err);
    });
  });
  app.post("/api/memos", function(req, res) {
    db.Memo.create({
      Memo_Text: req.body.memo_text,
      Memo_Date: req.body.memo_date,
      UserId: req.body.user_id
    }).then(function(data) {
      res.json(data);
    });
  });
  // =========================================================================================================================================
  // Forgot password token
  // =========================================================================================================================================
  // route if user forgets password
  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user.email
    });
  }); //close of get forget
  app.post('/forgot', function(req, res, next) {
    async.waterfall([
            function(done) {
              // making token for reset use
              crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
              });
            },
            function(token, done) {
              db.User.find({
                where: {
                  email: req.body.email
                }
              }).then(function(user) {
              // Check if record exists in db update record with token
                  if (user) {
                    user.updateAttributes({
                    token: token
                }).then(function(weUpdatedThis) {
                    // once user record is updated with token, send email to user
                    let transporter = nodemailer.createTransport({
                      host: 'smtp.sendgrid.net',
                      port: 587,
                      secure: false, // true for 465, false for other ports
                      auth: {
                        user: process.env.USERNAME,
                        pass: process.env.PASSWORD
                      }
                    });
                    var mailOptions = {
                      to: user.email,
                      from: 'Nebula@demo.com',
                      subject: 'Password Reset',
                      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    }; //close of mailOptions
                    // send mail with defined transport object (token)
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        return console.log('error from nodemailer !!!!!!', error);
                      }
                      res.redirect('/');
                    });
                  }); //end of weUpdatedThis
                  }//end of dbUser token record update
                });//end of user
            }//end of db.user.find
          ])//end of async waterfall
  });//end of post forgot

  // ==========================================================================================================================================
  // Reset User Password
  // ==========================================================================================================================================
    app.post('/reset', function(req, res) {
      async.waterfall([
        function(done) {
          //finding user in db with token
          db.User.find({
            where: {
            token: req.body.token
            }
          }).then(function(user) {
            //updating new user password and emptying token field
            if (user) {
              user.updateAttributes({
                password: req.body.password,
                token: null
              }).then(function(weUpdatedThisPassword) {
                //redirect to landing page
                  res.redirect('/');
                })
              // validating password with bcrypt at creation 
              db.User.prototype.validPassword = function(password) {
              return bcrypt.compareSync(password, this.password);
                };
              User.hook("beforeUpdate", function(user) {
                //hashing new password in db
                user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
                });
            }//end of if
            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
      },//end of done function
    ], 
      function(err) {
        res.redirect('/');
      }
    ); //end of async waterfall
  });//end of post reset
  
}; // *** END ***