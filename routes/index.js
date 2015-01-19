var express = require('express');
var router = express.Router();
var airlineAPI = require('../modules/airlineAPI');	

/* GET home page. */
router.get('/', function(req, res, next) {
  airlineClient = airlineAPI.getApiClient(req.ENVIRONMENT);	
  airlineClient.getAirlines(function(airlines){

	res.render('index', {
		airlines: JSON.stringify(airlines)
	});
  });
});

module.exports = router;
