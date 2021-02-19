// General imports
const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const Trail = mongoose.model('Trail');

const path = require('path');
const auth = require('http-auth')

// Instantiates basic, as used for 'admin' log-in
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

// Processes browser requests for localhost:3000/ - The registration form
router.get('/', (req, res) => {
  res.render('form', { title: 'Registration form' });
});

// Processes browser requests for /registrations - the list of registrations
// Basic.check drives the log-in feature, satisfied by the username & password
// in users.htpasswd
router.get('/registrations', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
}));

// Processes browser requests for /trailupdater - the trail work logging form
router.get('/trailupdater', (req, res) => {
  res.render('trailupdater', { title: 'Trails Updater' });
});

// Processes browser requests for /traillog - the trail listings
router.get('/traillog', (req, res) => {
  Trail.find()
    .then((trails) => {
      res.render('traillog', { title: 'Listing trails', trails });
    })
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

// Processes POST requests for / - adds (valid) input to the db
router.post('/',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter an email'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const registration = new Registration(req.body);
      registration.save()
        .then(() => { res.send('Thank you for your registration!'); })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });
    } else {
      res.render('form', {
        title: 'Registration form',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

router.post('/trailupdater',
  [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Please enter a name'),
    check('junction1')
      .isLength({ min: 1 })
      .withMessage('Please enter the trail start'),
    check('junction2')
      .isLength({ min: 1 })
      .withMessage('Please enter the trail end'),
    check('lastWorked')
      .isLength({ min: 1 })
      .withMessage('Please enter a work date'),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const trail = new Trail(req.body);
      trail.save()
        .then(() => { 
          res.render('trailupdater', { title: 'Trails Updater' })
        })
        .catch((err) => {
          console.log(err);
          res.send('Sorry! Something went wrong.');
        });
    } else {
      res.render('trailupdater', {
        title: 'Trail Updater',
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

module.exports = router;

// console.log(req.body);