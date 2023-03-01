const passport = require('passport');

const facebookAuth = passport.authenticate('facebook', { scope: ['profile', 'email'],failureRedirect: '/'});

const facebookCallback = passport.authenticate('facebook', (req, res) => {
    if (req.isAuthenticated) {
        res.status(200).send('successfully login');
    }
    else {
        res.status(400).send('logIn error')
    }
});

module.exports = {
    facebookAuth,
    facebookCallback
}