'use strict';

const express = require('express');
const router = express.Router();

const Bike = require('../models/bike');

const upload = require('../configs/multer');

router.post('/', upload.single('file'), (req, res, next) => {
  const color = req.body.color;
  const brand = req.body.brand;
  const owner = req.session.currentUser._id;
  const image = req.file;

  console.log(image);
  // console.log(brand);
  // console.log(color);

  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  if (!color || !brand) {
    console.log('hollaaaa');
    return res.status(422).json({code: 'validation'});
  }

  const newBike = Bike({
    owner,
    color,
    brand,
    image
  });

  return newBike.save()
    .then((bike) => {
      // console.log(bike);
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
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  if (!latitude && !longitude) {
    latitude = 0;
    longitude = 0;
  }

  console.log(latitude, longitude);

  const updates = {
    location: [Number(latitude), Number(longitude)],
    parkStatus: req.body.parkStatus
  };
  console.log(req.body.parkStatus);
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
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  console.log(latitude, longitude);

  Bike.find({
    location:
      { $geoNear:
         {
           $geometry: { type: 'Point', coordinates: [ Number(latitude), Number(longitude) ] },
           $maxDistance: 100
         }
      }
  })
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      } else {
        res.json(result);
        console.log(result);
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
      }
    });
});

module.exports = router;
