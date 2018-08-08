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
  number: {
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
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [{ type: Number }],
      default: [10, 10]
    }
  },
  imageUrl: {
    type: String
  }
});

const Bike = mongoose.model('Bike', bikeSchema);

module.exports = Bike;
