const jwt = require('jsonwebtoken');
const userData = require('../models/userModel');
// const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');

const authenticateToken = async(req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        const token = authToken && authToken.split(' ')[1];
        if (token === null) {
            res.status(400).send('Not authorized');
        }
        else {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                if (err) {
                    res.status(403).json(err);
                }
                else {
                    req.user = user;
                    next();
                }
            })
        }
    }
    catch (err) {
        res.status(500).json({ error: err});
    }
};

const verifyResetPassword = async (req, res, next) => {
    try {
      const { token } = req.query;
      const user = await userData.findOne({ forgotToken: token });
  
      if (user) {
      // res.redirect('resetPasswordPage');
        return res.json(user);
      }
      else {
        return res.status(400).send('error');
      }
      next();
    }
    catch (err) {
      res.status(400).json({ error: err });
    }
  };

module.exports = {
    authenticateToken,
    verifyResetPassword
}
