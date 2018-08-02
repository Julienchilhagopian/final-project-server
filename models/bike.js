'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  userId: {
    type: String
  },
  brand: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  parkStatus: {
    type: Boolean
  },
  alert: {
    type: String
  },
  location: {
    type: String
  }
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
