var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    img: process.env.CREATURE_IMAGE || 'images/gopher.png',
    title: process.env.DANCE_PARTY_TITLE || 'Generic Dance Party'
  });
});

router.get('/performance', function(req, res, next) {
  res.render('perf');
});

// TODO: Extract into REST API/API Gateway?
router.get('/bootstrap', function(req, res, next) {
  // TODO: Replace with consul lookup
  const STATE_SERVER = `http://${process.env.STATE_SERVER}` || 'http://dancefloor:5001';
  request({url: `${STATE_SERVER}/fetch`}, function(error, response, body) {
    if (error) {
      console.log('could not get state from', STATE_SERVER);
      return res.status(500).send({error: error});
    }
    return res.set('Content-Type', 'text/json').status(200).send(body);
  });
});

module.exports = router;
