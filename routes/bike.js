'use strict';

const express = require('express');
const router = express.Router();

const Bike = require('../models/bike');
const upload = require('../configs/multer');
require('dotenv').config();

// ---- TWILIO API KEYS ---- //

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

router.post('/', upload.single('file'), (req, res, next) => {
  const number = req.body.number;
  const brand = req.body.brand;
  const owner = req.session.currentUser._id;
  const image = req.file;
  let imageUrl = '';

  // transforming url to a good one
  let goodUrl = (url) => {
    var urlArray = url.split('/');
    urlArray.shift();
    imageUrl = urlArray.join('/');
  };
  goodUrl(image.path);

  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  if (!number || !brand) {
    return res.status(422).json({code: 'validation'});
  }

  const newBike = Bike({
    owner,
    number,
    brand,
    imageUrl
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

  const updates = {
    location: [Number(latitude), Number(longitude)],
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
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;

  const date = Date.now();
  console.log('Search:', latitude, longitude);

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
      const finished = Date.now();
      res.json(result);
      console.log('Search:', finished - date, result.length);
    });
});

router.put('/report', (req, res, next) => {
  const bikeId = req.body.id;
  const updates = {
    report: req.body.reportStatus
  };
  const emojiWarn = '\u26A0';
  const emojiBike = '\uD83D\uDEB2';
  const emojiAlarm = '\uD83D\uDEA8';
  const number = req.body.number;

  if (req.body.reportStatus && number) {
    client.messages
      .create({
        body: `BICILANTE COMPANY - ${emojiWarn}${emojiBike}${emojiAlarm} WARNING YOUR BIKE IS BEING STOLEN ${emojiWarn}${emojiBike}${emojiAlarm}`,
        from: '+33644607404',
        to: number
      })
      .then(message => console.log('Tzilio messge out:', message.sid))
      .done();
  }

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
