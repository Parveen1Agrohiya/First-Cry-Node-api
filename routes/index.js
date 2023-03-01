const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');

const userService = require('../service/userService');
const authenticate = require('../middleware/auth');
// const userData = require('../models/userModel');
// const { registerSchema } = require('../validation/authValidation');
const category = require('../service/category');
const product = require('../service/product');
const cartService = require('../service/cartService');
const googleAuth = require('../googleAuth');
const facebookAuth = require('../facebookAuth');

router.get('/', function(req, res) {
  res.send('Hello');
});

router.post('/register', userService.register );

router.post('/verify_otp', userService.verifyOtp);

router.post('/login', userService.login);

router.post('/login_verify_otp', userService.loginVerifyOtp);

router.post('/verifypassword', userService.verifypassword);

router.post('/forgotpassword', userService.forgotPassword);

router.get('/resetPassword', authenticate.verifyResetPassword);

router.post('/resetPassword/:id', userService.resetPassword);

router.get('/auth/google', googleAuth.googleAuth);

router.get('/auth/google/callback', googleAuth.googleCallback);

router.get('/auth/facebook', facebookAuth.facebookAuth);

router.get('/auth/facebook/callback',facebookAuth.facebookCallback);

router.post('/uploadcategoryimage', category.uploadCategoryImage);

router.post('/category', category.addCategory);

router.get('/allcategory', category.getAllCategory);

router.get('/getcategoryimage/:filename', category.getCategoryImage);

router.get('/category/:id', category.getOneCategory);

router.post('/product', product.productList);

router.get('/allproducts', product.getAllProduct);

router.get('/product/:id', product.getOneProduct);

router.get('/getproductimage/:filename', product.getProductImage);

router.get('/getCart', authenticate.authenticateToken, cartService.getCart);

router.get('/addcart/:productId', authenticate.authenticateToken, cartService.addIntoCart);

router.get('/udpateIntoCart', authenticate.authenticateToken, cartService.udpateIntoCart);

router.get('/cartRemoveProduct/:productId', authenticate.authenticateToken, cartService.cartRemoveProduct);

router.delete('/emptyCart', authenticate.authenticateToken, cartService.emptyCart);

router.get('/myprofile', authenticate.authenticateToken, userService.myProfile);

module.exports = router;
