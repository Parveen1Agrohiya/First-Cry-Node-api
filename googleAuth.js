const passport = require('passport');
const jwt = require('jsonwebtoken');

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'],failureRedirect: '/'});

const googleCallback = passport.authenticate('google', (req, res) => {
    if (req.isAuthenticated()) {
        // res.status(200).send('successfull logIn');
        const payload = {
            email: req.user.email,
            displayName: req.user.displayName
        }
        const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
        res.status(200).json({ accessToken: generateToken});
    }
    else {
        res.status(400).send('logIn error')
    }
});

module.exports = {
    googleAuth,
    googleCallback
}