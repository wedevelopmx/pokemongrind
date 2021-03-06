// config/passport.js

var passport = require('passport');

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var models       = require('../models');

// load the auth variables
var configAuth = require('./auth');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    console.log('------------------- serialize ---------------------' + user.id);
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    console.log('------------------- deserialize ---------------------' + id);
    models.User
      .findOne({
        attributes: ['id', 'displayName', 'avatar', 'bio', 'website', 'level'],
        where: { id: id },
        include: [{
          attributes: ['name', 'token'],
          model: models.Account,
          as: 'accounts'
        }, {
          attributes: ['id', 'name', 'avatar', 'motto'],
          model: models.Team
        }]
      })
      .then(function(user) {
        user = user.get({ plain: true });
        user.sync = {};
        for(i in user.accounts) {
          var account = user.accounts[i];
          user.sync[account.name] = account;
        }

        done(null, user);
      });
});

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
passport.use(new FacebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
    profileFields   : configAuth.facebookAuth.profileFields
},
// facebook will send back the token and profile
function(accessToken, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

      console.log(profile);

      var user = {
        displayName: profile.name.givenName + ' ' + profile.name.middleName,
        //company: { type: DataTypes.STRING, name: 'company' },
        //location: { type: DataTypes.STRING, name: 'location' },
        //bio: { type: DataTypes.TEXT, name: 'bio' },
        email: profile.emails[0].value,
        website: 'http://facebook.com/' + profile.id,
        //twitter: { type: DataTypes.STRING, name: 'twitter' },
        //github: { type: DataTypes.STRING, name: 'github' },
        //linkedin:{ type: DataTypes.STRING, name: 'linkedin' },
        avatar: profile.photos[0].value
      };

      var account = {
        name: profile.provider,
        providerId: profile.id,
        // joinedAt: ,
        // updatedAt: ,
        // htmlUrl: ,
        // reposUrl: ,
        token: accessToken
      };

      models.User
        .findOrCreate({ where: { email: user.email }, defaults: user })
        .spread(function(user, userCreated) {

          if(!userCreated) {
            user.update({
              website: 'http://facebook.com/' + profile.id,
              avatar: profile.photos[0].value
            });
          }
          //Making the relationship
          account.UserId = user.id;

          models.Account
            .findOrCreate({ where: { userId: user.id, name: account.name }, defaults: account })
            .spread(function(account, accountCreated) {

              if(!accountCreated && account.token !== accessToken)
                account.update({ token: accessToken}, { fields: ['token'] })
                  .then(function(updateUser) {

                  });
            });

          return done(null, user);
        });

    });

}));

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================
passport.use(new GoogleStrategy({
    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
    },
    function(accessToken, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
          var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;

          var user = {
            displayName: profile.displayName,
            //company: { type: DataTypes.STRING, name: 'company' },
            //location: { type: DataTypes.STRING, name: 'location' },
            //bio: { type: DataTypes.TEXT, name: 'bio' },
            email: profile.emails[0].value,
            //website: { type: DataTypes.STRING, name: 'website' },
            //twitter: { type: DataTypes.STRING, name: 'twitter' },
            //github: { type: DataTypes.STRING, name: 'github' },
            //linkedin:{ type: DataTypes.STRING, name: 'linkedin' },
            avatar: profile.photos[0].value
          };

          var account = {
            name: profile.provider,
            providerId: profile.id,
            // joinedAt: ,
            // updatedAt: ,
            // htmlUrl: ,
            // reposUrl: ,
            token: accessToken
          };

          models.User
            .findOrCreate({ where: { email: user.email }, defaults: user })
            .spread(function(user, userCreated) {

              //Making the relationship
              account.UserId = user.id;

              models.Account
                .findOrCreate({ where: { userId: user.id, name: account.name }, defaults: account })
                .spread(function(account, accountCreated) {

                  if(!accountCreated && account.token !== accessToken)
                    account.update({ token: accessToken}, { fields: ['token'] })
                      .then(function(updateUser) {

                      });
                });

              return done(null, user);
            });

        });

    }));

module.exports = passport;
