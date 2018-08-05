'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const bikeSchema = new Schema({
  owner: {
    type: ObjectId,
    ref: 'User'
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
  report: {
    type: Boolean
  },
  location: {
    type: String
  }
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
