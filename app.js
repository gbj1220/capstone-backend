/* eslint-disable no-console */
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');

const usersRouter = require('./routes/usersRouter');
const indexRouter = require('./routes/index');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MONGO DB CONNECTED');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
