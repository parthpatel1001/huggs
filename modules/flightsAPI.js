var redis = require("redis"),
    redisClient = redis.createClient();
  	redisClient.on('error',function(err){
  		console.log(err);
  	}),
  	restclient = require('restler');;

module.exports = {
	getApiClient : function(ENVIRONMENT){
		this.redisClient = redisClient;
		this.ENVIRONMENT = 'test';
		// console.log(ENVIRONMENT);
		var that = this;

		var REDIS_KEY_SEPERATOR = '|||',
		    FLIGHT_REQUEST_EXPIRES = 600; //seconds


		var getFlightKeyString = function(airline,flight_num) {
			return airline + REDIS_KEY_SEPERATOR + flight_num;
		};

		this.setFlightRequestToCache = function(airline,flight_num,data) {
			var flightKeyString = getFlightKeyString(airline,flight_num);
			this.redisClient.set(flightKeyString,JSON.stringify(data));
			this.redisClient.expire(flightKeyString, FLIGHT_REQUEST_EXPIRES);
		};

		//gets the flight data from cache if there
		//if not, reaches out to the api and stores it in cache
		this.getFlightData = function(airline,flight_num, callback) {
			this.redisClient.get(getFlightKeyString(airline,flight_num),function(err,reply){
				if(reply) {
					callback(JSON.parse(reply));
				} else {
					if(err) {
						console.log('error getting flight data :'+err);
						callback('error getting flight data');
					} else {
						restclient.get(ENVIRONMENT.fxml_url+'FlightInfoEx',{
							username: ENVIRONMENT.username,
							password: ENVIRONMENT.apiKey,
							query: {
								ident:airline+flight_num,
								howMany:1
							}
						}).on('success',function(result,response){
							if(!response.error && result.FlightInfoExResult && result.FlightInfoExResult.flights && result.FlightInfoExResult.flights[0]) {

								var flight_info = result.FlightInfoExResult.flights[0];
								var depart_time,arrive_time,from_airport,dest_airport;

								if(flight_info.actualdeparturetime) {
									depart_time = flight_info.actualdeparturetime;
								} else {
									depart_time = flight_info.filed_departuretime;
								}

								if(flight_info.actualarrivaltime) {
									arrival_time = flight_info.actualarrivaltime;
								} else {
									arrival_time = flight_info.estimatedarrivaltime;
								}

								from_airport = flight_info.origin;
								dest_airport = flight_info.destination;
								var responseToCache = {
							  			from_airport      : from_airport,
							  			dest_airport      : dest_airport,
							  			depart_time       : depart_time,
							  			arrive_time       : arrival_time
						  		};

								that.setFlightRequestToCache(
									airline,
									flight_num,
									responseToCache
								);
								that.getFlightData(airline,flight_num,callback);

							} else {
								callback('error getting flight data');
							}

						});
					}
				}
			});
		}

		return this;
	}
};