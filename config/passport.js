// Config/passport.js

// Load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// Load up the user model
var User = require('../app/models/user');

// Expose this function to our app using module.exports
module.exports = function(passport){
  //===========================================================
  // Passport Session Setup====================================
  //===========================================================
  // Required for persistent login sessions
  // Passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
  });

  //=========================================================
  // LOCAL SIGNUP============================================
  //=========================================================
  // We are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called local

  passport.use('local-signup', new LocalStrategy({
      // by default, local strategy uses name and password, we will override with email
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    function(req, email, password, done){
      //asynchronous
      // User.findOne wont fire unless data is sent back
      process.nextTick(function(){
        // find a user whos email is the same as the forms email
        // we are checking if the user trying to login already exists

        User.findOne({'local.email':email},function(err, user){
          // if there are any errors, return them
          if(err){
            console.log('err: '+err);
            return done(err);
          }

          // check to see if theres already a user with that email
          if(user){
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          }else{
            console.log('signing user up now!')
            // If there is no user with that email
            // create the user
            let newUser = new User();
            //set the users credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err){
              if(err)
                throw err;
              return done(null, newUser)
            });
          }

        });
      });
    }
  ));
}
