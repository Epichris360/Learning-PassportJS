// app/routes.js

module.exports = (app, passport) => {
  //=================================
  // Home Page (with login links)====
  //=================================
  app.get('/',(req, res) => {
    res.render('index.ejs');
    return;
  });
  //=================================
  // LOGIN ==========================
  //=================================
  // Show the login form
  app.get('/login', (req, res) => {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {message: req.flash('loginMessage')});
    return;
  });

  // process the login form
    app.post('/login', passport.authenticate('local-login',{
      successRedirect: '/profile', //redirect to the secure profile section
      failureRedirect: '/login',  //redirect back to the signup page if there is an error
      failureFlash: true,        // allow flash messages
    }));

  // ================================
  // SIGNUP =========================
  //=================================
  // show the signup form

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('signupMessage')});
    return;
  });

  // Process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));


  // =======================================
  // PROFILE SECTION =======================
  // =======================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)

  app.get('/profile', (req, res) => {
    res.render('profile.ejs',{user: req.user}); //get the user out of session and pass to template
    return;
  })

  //==============================================
  // Facebook Routes==============================
  //==============================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook',{
    scope: ['public_profile', 'email']
  }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook',{
    successRedirect: '/profile', failureRedirect: '/'
  }));

  //==========================================
  // TWITTER ROUTES===========================
  //==========================================
  // route for twitter auth and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter',{
    successRedirect: '/profile', failureRedirect: '/'
  }));

  // =========================================
  // LOGOUT ==================================
  // =========================================
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
    return
  });

  //======================================================================
  // Authorize (Already logged in / connecting other social accounts)=====
  //======================================================================
  // locally----------------------------------
  app.get('/connect/local', (req, res) => {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });
  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash:    true // allow flash messages
  }));
  // facebook---------------------------------------
  app.get('/connect/facebook', passport.authorize('facebook',{
    scope: ['public_profile', 'email']
  }));
  app.get('/connect/facebook/callback', passport.authorize('facebook',{
    successRedirect: '/profile',
    failureRedirect: '/'
  }));
  // twitter------------------------------------------------
  // send to twitter to do the authentication
  app.get('/connect/twitter', passport.authorize('twitter',{scope: 'email'}));
  // handle the callback after twitter has authorized the user
  app.get('/connect/twitter/callback', passport.authorize('twitter',{
    successRedirect: '/profile',
    failureRedirect: '/'
  }));


  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local------------------------------------------------------
  app.get('/unlink/account', (req, res) => {
    let user            = req.user;
    user.local.email    = undefined;
    user.local.password = undefined;
    user.save(function(err){
      res.redirect('/profile');
    });
  });
  // facebook-------------------------------------------------
  app.get('/unlink/facebook', (req, res) => {
    let user            = req.user;
    user.facebook.token = undefined;
    user.save(function(err){
      res.redirect('/profile');
    });
  });
  // twitter----------------------------------------------------
  app.get('/unlink/twitter', (req, res) => {
    let user           = req.user;
    user.twitter.token = undefined;
    user.save(function(err){
      res.redirect('/profile');
    })
  })
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next){
  // if user is authenticated in the session , carry on
  if (req.isAuthenticated())
    return next();

  // if they arent redirect them to the home page
  res.redirect('/')
  return
}
