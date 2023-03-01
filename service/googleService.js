const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleData = require('../models/googleModel');
const sessionStorage = require('sessionstorage');

passport.use('google', new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
function(token, profile, done) {
    // console.log(token);
    // console.log(profile);
    // sessionStorage.setItem('token', token),
    
    process.nextTick(() => {
        googleData.findOne({ googleId: profile.id },(err, user) => {
            if (err)
                return done(err);
                if (user) {
                    return done(null, user)
                }
                else {
                    const newUser = new googleData();
                    newUser.googleId = profile.id,
                    newUser.displayName = profile.displayName,
                    newUser.firstName = profile.name.givenName,
                    newUser.lastName = profile.name.familyName,
                    newUser.email = profile.emails[0].value,
                    newUser.image = profile.photos[0].value
                    newUser.save((err) => {
                        if (err)
                            throw err;
                            return done(null, newUser);
                    })
                }
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