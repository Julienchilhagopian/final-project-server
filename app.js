'use strict';

// ---- REQUIREMENTS---- //
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// ---- ROUTES REQUIREMENTS---- //
const auth = require('./routes/auth');

const app = express();

// ---- MIDDLEWARES ---- //
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: ['http://localhost:4200']
}));

// ---- ROUTE SET UP ---- //
app.use('/auth', auth);

// ---- ERRORS HANDLERS---- //
app.use((req, res, next) => {
  res.status(404).json({code: 'not found'});
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({code: 'unexpected'});
  }
});

module.exports = app;
