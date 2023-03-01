const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const facebookData = require('../models/facebookModel');
const sessionStorage = require('sessionstorage');

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback'
},
function(token, profile, done) {
    // console.log(token);
    // console.log(profile);
    sessionStorage.setItem('token', token);

    process.nextTick(() => {
        facebookData.findOne({ facebookId: profile.id}, (err, user) => {
            if (err) 
                return done(err);
                if (user) {
                    return done(null,user);
                }
                else {
                    const newUser  = new facebookData();
                    newUser.facebookId = profile.id,
                    newUser.displayName = profile.displayName,
                    newUser.firstName = profile.givenName,
                    newUser.lastName = profile.name.familyName,
                    newUser.email = profile.emails[0].value
                }
                newUser.save((err) => {
                    if (err)
                    throw err
                    return done(null,user)
                })
        })
    })
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    googleData.findById(id,(err, user) => {
        done(err, user);
    })
});