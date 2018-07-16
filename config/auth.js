 // config/auth.js

 // expose our config directly to our application using module.exports
 module.exports = {

     'facebookAuth' : {
         'clientID'      : '204215470292954', // your App ID
         'clientSecret'  : 'c734afb46effa84eb55586e15b3bc593', // your App Secret
         'callbackURL'   : 'http://localhost:3000/auth/facebook/callback',
         'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
         'profileFields' : ['id', 'emails', 'name'] // For requesting permissions from Facebook API
     },

     'twitterAuth' : {
         'consumerKey'       : 'your-consumer-key-here',
         'consumerSecret'    : 'your-client-secret-here',
         'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
     },

     'googleAuth' : {
         'clientID'      : 'your-secret-clientID-here',
         'clientSecret'  : 'your-client-secret-here',
         'callbackURL'   : 'http://localhost:3000/auth/google/callback'
     }

 };
