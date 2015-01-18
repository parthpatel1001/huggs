var express = require('express');
var router = express.Router();
var airlineAPI = require('../modules/airlineAPI'),
	airlineClient = airlineAPI.getApiClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  airlineClient.getAirlines(function(airlines){
	res.render('index', { 
		title: 'Express',
		airlines: JSON.stringify(airlines)
	});
  });
});

module.exports = router;
