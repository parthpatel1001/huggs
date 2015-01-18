/*
 * load express & router
 */
var express = require('express');
var router = express.Router();

/*
 * load flight api
 */
var flightAPI = require('../modules/flightsAPI'),
	flights = flightAPI.getApiClient();

/* GET flights resource. */
router.get('/', function(req, res, next) {
	

	var airline = req.param('airline'),
	flight_num = req.param('flight_num');


  	console.log('airline: '+airline);
  	console.log('flight_num: '+flight_num);

  	
  	flights.getFlightData(airline,flight_num,function(reply){
  		res.writeHead(200, { 'Content-Type': 'application/json' });	
	
		res.end(JSON.stringify({
	  		airline: airline,
	  		flight_num : flight_num,
	  		cache_res : reply
	  	}));
  	});
});

module.exports = router;
