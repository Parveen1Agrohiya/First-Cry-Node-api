require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mail = require('./mailService');
const accountSid = process.env.ACCOUNT_SID;
const accountToken = process.env.ACCOUNT_TOKEN
const twilioClient = require('twilio')(accountSid, accountToken);
const userData = require('../models/userModel');
const mail = require('./mailService');
const { registerSchema, resetPasswordSchema } = require('../validation/authValidation');

const register = async (req, res) => {
    try {
        const result = registerSchema.validate(req.body);
        // console.log(result);
        if (result.error) {
          // console.log(result);
          // console.log(result.error.details[0]);
          return res.status(400).send(result.error.details[0].context.label);
        }
        // const email = (req.body.email).toLowerCase();
        const isMailPresent = await userData.findOne({ email: result.value.email });
        const isMobileNoPresent = await userData.findOne({ mobileno: result.value.mobileno });
        if (isMailPresent && isMobileNoPresent) {
          return res.status(400).send('An account already exists with the same email id & mobile number.');
        }
        else if (isMobileNoPresent) {
          return res.status(400).send('An account already exists with the same mobile number.');
        }
        else if (isMailPresent) {
          return res.status(400).send('An account already exists with the same email id.');
        }
        else {
          // twilioClient.verify.services(process.env.SERVICE_ID).verifications
          // .create({
          //   from: '+17406406272',
          //   to: `+91${result.value.mobileno}`,
          //   channel: 'sms'
          // }).then((message) => {
          //   // res.send(message);
              return res.status(201).send('OTP sent');
          // })
          //   .catch((err) => console.log(err))
        }
      }
      catch (err) {
        res.status(400).json({ error: err})
      }
}

const verifyOtp = async (req, res) => {
  try {
    const { otp, fullname, mobileno, email, password } = req.body;

    const isOtp = await twilioClient.verify.services(process.env.SERVICE_ID).verificationChecks
            .create({
              to: `+91${mobileno}`,
              code: otp
            })
            .then(async(message) => {
              // res.send(message);
              if(message.valid) {
                const user = new userData({
                    fullname: fullname,
                    mobileno: mobileno,
                    email: email,
                    password: await bcrypt.hash(password, 10)
                  })
                  await user.save();
                  res.status(201).send('Registered Successfully');
              }
              else {
                res.status(400).send('Invalid OTP');
              }
            })
  }
  catch (err) {
    res.status(400).json({ error: err.message})
  }
}

const login = async (req, res) => {
  try {
    const { loginDetails } = req.body;

    let isUserExist = null;

    if (!loginDetails) {
      return res.status(400).json({status: 400, message: 'Please enter your Email ID or Mobile No.'})
    }
    else if(loginDetails.indexOf('@') > -1) {
      isUserExist = await userData.findOne({ email: loginDetails });
      // console.log(isUserExist);
      if(!isUserExist) {
        return res.status(400).send(`Kindly fill & submit the below information to create your FirstCry account with ${loginDetails}`);
        // return res.send('Email must be a valid email');
      }
    }
    else {
      isUserExist = await userData.findOne({ mobileno : loginDetails });
      if(!isUserExist) {
        return res.status(400).send(`Kindly fill & submit the below information to create your FirstCry account with ${loginDetails}`);
      }
    }
    
    // twilioClient.verify.services(process.env.SERVICE_ID).verifications
    //             .create({
    //               to: `+91${isUserExist.mobileno}`,
    //               channel: 'sms'
    //             }).then(message => console.log(message))
    //             .catch((err) => console.log(err))  
    // twilioClient.verify.v2.services(process.env.SERVICE_ID).verifications
    //             .create({
    //               to: isUserExist.email, 
    //               channel: 'email'
    //             }).then(verification => console.log(verification));
    
    return res.status(200).send('Otp sent');
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
  
}

const loginVerifyOtp = async(req, res) => {
  try {
    const { otp, loginDetails } = req.body;
    let isUserExist = null;
    if (loginDetails.indexOf('@')>-1) {
      isUserExist = await userData.findOne({ email: loginDetails });
      // res.send(isUserExist)
    }
    else {
      isUserExist = await userData.findOne({mobileno: loginDetails });
    }

 await twilioClient.verify.services(process.env.SERVICE_ID).verificationChecks
            .create({
              to: `+91${isUserExist.mobileno}`,
              code: otp
            })
            .then((message) => {
              // res.send(message);
              if(message.valid) {
                  // res.status(201).send('LogIn Successfully');
                  const payload = {
                    id: isUserExist._id,
                    mobileno: isUserExist.mobileno,
                    email: isUserExist.email
                  }
                  const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
                  res.status(200).json({ accessToken: generateToken});
              }
              else {
                res.status(400).send('Invalid OTP');
              }
            })
  }
  catch (err) {
    res.status(400).json({ error: err.message})
  }
}

const verifypassword = async (req, res) => {
  try {
    const { loginDetails } = req.body;
    const { password } = req.body;
  
    if (loginDetails.indexOf('@') > -1) {
      const emailPresent = await userData.findOne({ email : loginDetails });
      if (!emailPresent) {
        return res.status(400).send('Invalid email')
      }
      else {
        const isPasswordMatch = await bcrypt.compare(password, emailPresent.password);
        if(isPasswordMatch) {
            // res.status(200).send('Succesfully LoggedIn');
            const payload = {
              id: emailPresent._id,
              fullname: emailPresent.fullname,
              email: emailPresent.email
            }
            const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
            res.status(200).json({ accessToken: generateToken});
          }
          else {
            res.status(400).send('Incorrect password / Password expired');
          }
      }
       // console.log(emailPresent);
  
      // if(isPasswordMatch) {
      //   // res.status(200).send('Succesfully LoggedIn');
      //   const payload = {
      //     fullname: emailPresent.fullname,
      //     email: emailPresent.email
      //   }
      //   const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
      //   res.status(200).json({ accessToken: generateToken});
      // }
      // else {
      //   res.status(400).send('Incorrect password / Password expired');
      // }
    }
    else {
      const isMobilePresent = await userData.findOne({ mobileno : loginDetails });
      if (!isMobilePresent) {
        return res.status(400).send('Invalid MobileNo')
      }
      else {
        const isPasswordMatch = await bcrypt.compare(password, isMobilePresent.password);
        if(isPasswordMatch) {
          // res.status(200).send('Succesfully LoggedIn');
          const payload = {
            id: isMobilePresent._id,
            mobileno: isMobilePresent.mobileno,
            fullname: isMobilePresent.fullname
          }
          const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(200).json({ accessToken: generateToken});
        }
        else {
          res.status(400).send('Incorrect password / Password expired');
        }
      }
      // console.log(isMobilePresent);
  
      // if(isPasswordMatch) {
      //   // res.status(200).send('Succesfully LoggedIn');
      //   const payload = {
      //     mobileno: isMobilePresent.mobileno,
      //     fullname: isMobilePresent.fullname
      //   }
      //   const generateToken = jwt.sign(payload, process.env.TOKEN_SECRET);
      //   res.status(200).json({ accessToken: generateToken});
      // }
      // else {
      //   res.status(400).send('Incorrect password / Password expired');
      // }
    }
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

const forgotPassword = async (req, res) => {
  try {
    const result = resetPasswordSchema.validate(req.body);
        // console.log(result);
        if (result.error) {
          return res.status(400).send(result.error.details[0].context.label);
        }
  // const { logindetails, newPassword, confirmPassword } = req.body;
  if (result.value.logindetails.indexOf('@')>-1) {
    const isEmailPresent = await userData.findOne({ email: result.value.logindetails});
    isEmailPresent.password = await bcrypt.hash(result.value.newPassword, 10);
    await isEmailPresent.save();
    res.status(200).send('password updated');
  }
  else {
    const isMobileNoPresent = await userData.findOne({ mobileno: result.value.logindetails});
    isMobileNoPresent.password = await bcrypt.hash(result.value.newPassword, 10);
    isMobileNoPresent.save();
    res.status(200).send('Password Updated');
  }
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const forgotPassword = async (req, res) => {
//     try {
//       const { loginDetails, host } = req.body;
//       let isUserExist = null;

//     if (loginDetails.indexOf('@')>-1) {
//        isUserExist = await userData.findOne({ email: loginDetails});
//         // return res.send(isUserExist)
//       // isEmailPresent.password = await bcrypt.hash(result.value.newPassword, 10);
//       // await isEmailPresent.save();
//       // res.status(200).send('password updated');
//     }
//     else {
//        isUserExist = await userData.findOne({ mobileno: loginDetails});
//       // isMobileNoPresent.password = await bcrypt.hash(result.value.newPassword, 10);
//       // isMobileNoPresent.save();
//       // res.status(200).send('Password Updated');
//     }
//     const secret = process.env.TOKEN_SECRET;
//       const payload = {
//         email: isUserExist.email
//       };
//       const token = jwt.sign(payload, secret, { expiresIn: '15m' });

//       isUserExist.forgotToken = token;
//       isUserExist.save();

//       // console.log(host);

//       mail.sendMail({
//         to: isUserExist.email,
//         from: 'parveenagrohiya910@gmail.com',
//         subject: 'forgot password',
//         html: `<h2> Hi ${isUserExist.fullname} </h2>
//       <h3> forgot your password.This Link will expire in 15 minutes.</h3>
//       <h3> Click here to Forgot your password
//       <a href="http://${req.headers.host}/resetPassword?token=${token}">Forgot Password</a>`
//       });
//       res.status(200).send('mail sent');

//     }
//     catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };

  const resetPassword = async (req, res) => {
    try {
      const userId = req.params.id;
      const result = resetPasswordSchema.validate(req.body);
      if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
      }
      const user = await userData.findById({ _id: userId });
      user.password = await bcrypt.hash(result.value.newPassword, 10);
      user.forgotToken = null;
      await user.save();
      res.send('password updated');
    }
    catch (err) {
      res.status(400).json({ error: err });
    }
  };

  const myProfile = async (req, res) => {
    try {
      const { id } =req.user;
      const isUserExist = await userData.findOne({ _id: id });
      // console.log(isUserExist);
      if (isUserExist) {
        res.status(200).json({ name: isUserExist.fullname, email: isUserExist.email, mobileno: isUserExist.mobileno});
      }
    }
    catch (err) {
      res.status(400).json({ error: err });
    }
  };

module.exports = {
    register,
    verifyOtp,
    loginVerifyOtp,
    login,
    verifypassword,
    forgotPassword,
    resetPassword,
    myProfile
}