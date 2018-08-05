'use strict';

const express = require('express');
const router = express.Router();

const Bike = require('../models/bike');

router.post('/', (req, res, next) => {
  const color = req.body.color;
  const brand = req.body.brand;
  const owner = req.session.currentUser._id;

  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  if (!color || !brand) {
    return res.status(422).json({code: 'validation'});
  }
  const newBike = Bike({
    owner,
    color,
    brand
  });

  return newBike.save()
    .then((bike) => {
      res.json(bike);
    });
});

router.get('/mine', (req, res, next) => {
  const owner = req.session.currentUser._id;

  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  Bike.find({owner})
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
      }
    });
});

router.get('/:id', (req, res, next) => {
  const bikeId = req.params.id;

  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  Bike.findById(bikeId)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
      }
    });
});

router.put('/status', (req, res, next) => {
  const bikeId = req.body.id;

  const updates = {
    location: req.body.location,
    parkStatus: req.body.parkStatus
  };

  Bike.findByIdAndUpdate(bikeId, updates)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
      }
    });
});

router.get('/', (req, res, next) => {
  let locationQuery = {};

  if (req.query.location) {
    locationQuery = {location: {$in: [req.query.location]}};
  }

  Bike.find(locationQuery)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
      }
    });
});

router.put('/report', (req, res, next) => {
  const bikeId = req.body.id;

  const updates = {
    report: req.body.reportStatus
  };

  Bike.findByIdAndUpdate(bikeId, updates)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
        console.log('hola que tal');
      }
    });
});

module.exports = router;
