var MongoClient = require('mongodb').MongoClient;
var util = require('util');
var restclient = require('restler');
var dotenv = require('dotenv');
dotenv.load();
var sleep = require('sleep');

var fxml_url = 'http://flightxml.flightaware.com/json/FlightXML2/';
var username = process.env.FLIGHT_AWARE_USERNAME;
var apiKey = process.env.FLIGHT_AWARE_APIKEY;
var mongo_host = process.env.MONGO_HOST;





// Connect to the db
MongoClient.connect("mongodb://"+mongo_host, function(err, db) {
	var airlines = db.collection('airlines');
	
	restclient.get(fxml_url + 'AllAirlines', {
	    username: username,
	    password: apiKey
	}).on('success', function(result, response) {
		var count = 0;
		
		result.AllAirlinesResult.data.forEach(function (element,index,array) {
			console.log('getting symbol: '+element);
			restclient.get(fxml_url+'AirlineInfo',{
				username : username,
				password: apiKey,
				query: {airlineCode: element}
			}).on('success',function(result,response){
				count++;
				//sleep so you dont get rate limited! couldnt find anything about rate limits in documentation though
				sleep.sleep(1);	
				var name_to_use = '';
				if(result && result['AirlineInfoResult'] && result.AirlineInfoResult['shortname'] && result.AirlineInfoResult['shortname'].length != 0) {
					if(result.AirlineInfoResult.shortname) {
						name_to_use = result.AirlineInfoResult.shortname;
					} else {
						name_to_use = result.AirlineInfoResult.name;
					}
				} else {
					console.log('weird result');
					console.log(result);
				}
				var doc = {
					symbol: element,
					airline_name:name_to_use
				};				
				console.log('adding doc '+count+' to database: ');
				console.log(doc);
				airlines.insert(doc,
					{w:1},function(err,result){
					console.log(err);
					console.log(result);
				});
			});
		});
	});	

});


