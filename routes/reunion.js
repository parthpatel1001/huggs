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


/* GET airports resource. */
router.get('/', function(req, res, next) {
	var airline = req.param('airline'),
	flight_num = req.param('flight_num'); 
	

  	flights.getFlightData(airline,flight_num,function(flightData){
  		res.render('reunion',flightData);
  	});	
});

module.exports = router;
