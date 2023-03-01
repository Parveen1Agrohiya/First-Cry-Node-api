require('dotenv').config();
// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

require('./service/googleService');
require('./service/facebookService');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(session({
  secret: 'secret',
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.MONGOOSEURL);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('This route is not available');
  error.status = 404;
  next(error);
//   next(createError(404));
});


// // // error handler
app.use((error, req, res, next) => {
//   // set locals, only providing error in development
//   // res.locals.message = err.message;
  res.status(error.status || 500);
  //   res.render('error');
  res.send({
    error: {
      status: error.status || 500,
      message: error.message
    }
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});

module.exports = app;
