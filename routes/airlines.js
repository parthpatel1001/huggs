/*
 * load express & router
 */
var express = require('express');
var router = express.Router();

/*
 * load flight api
 */
var airlineAPI = require('../modules/airlineAPI'),
	airlineClient = airlineAPI.getApiClient();

/* GET airports resource. */
router.get('/', function(req, res, next) {

  	airlineClient.getAirlines(function(airlines){
  		res.writeHead(200, { 'Content-Type': 'application/json' });	
	
		res.end(JSON.stringify(airlines));
  	});
});

module.exports = router;
