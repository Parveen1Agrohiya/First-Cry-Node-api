const Joi = require('joi');

const registerSchema = Joi.object({
    fullname: Joi.string().required()
              .label('name can not be null'),
    mobileno: Joi.string().pattern(/^[0-9]+$/)
              .label('Please enter valid Mobile No.'),
    email: Joi.string().required().email()
              .label('Email must be valid email'),
    password: Joi.string().min(8).pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).required()
              .label('Please enter valid Password')
    
});

const resetPasswordSchema = Joi.object({
    logindetails: Joi.string().required(),
    newPassword: Joi.string().min(8).pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/).required()
                .label('Please enter valid password'),
    confirmPassword: Joi.any().equal(Joi.ref('newPassword')).required()
                .label('Password does not Match')
  });

module.exports = { registerSchema, resetPasswordSchema };