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

  app.get('/privacy', (req, res) => {
    res.render('privacy.ejs');
    return;
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
