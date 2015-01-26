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
		var getFormattedFlightInfoResult = function(rawApiResponseData) {
			var depart_time,arrive_time,from_airport,dest_airport,
				flight_info = rawApiResponseData;

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

			var arrival_date_compare = new Date(arrival_time*1000).toDateString();
			var today_date_compare = new Date().toDateString();
			
			from_airport = flight_info.origin;
			dest_airport = flight_info.destination;
			from_airport = from_airport.substr(from_airport.length - 3);
			dest_airport = dest_airport.substr(dest_airport.length - 3);
			faFlightId   = flight_info.faFlightID;
			
			return {
		  			from_airport      : from_airport,
		  			dest_airport      : dest_airport,
		  			depart_time       : depart_time,
		  			arrive_time       : arrival_time,
		  			faId              : faFlightId
	  		};
		};
		var getFlightInfoFromFlightAwareAPI = function(airline,flight_num,callback) {
			restclient.get(ENVIRONMENT.fxml_url+'FlightInfoEx',{
				username: ENVIRONMENT.username,
				password: ENVIRONMENT.apiKey,
				query: {
					ident:airline+flight_num,
					howMany: 10
				}
			}).on('success',callback);
		}
		this.setFlightRequestToCache = function(airline,flight_num,data) {
			var flightKeyString = getFlightKeyString(airline,flight_num);
			this.redisClient.set(flightKeyString,JSON.stringify(data));
			this.redisClient.expire(flightKeyString, FLIGHT_REQUEST_EXPIRES);
		};

		//gets the flight data from cache if there
		//if not, reaches out to the api and stores it in cache
		this.getFlightData = function(airline,flight_num, id, callback) {
			this.redisClient.get(getFlightKeyString(airline,flight_num),function(err,reply){
				if(reply) {
					var flightListFromCache = JSON.parse(reply);
					if(flightListFromCache.error) {
						return callback({error:true});
					}
					var returnOnlyFutureFlights = [];

					if(id === undefined || id === null) {
						for(var i in flightListFromCache) {
							var today = new Date() ;
							var arrive = new Date(flightListFromCache[i].arrive_time * 1000);
							//set the h m s ms to 0 to compare the day of arrive vs today
							today.setHours(0,0,0,0);
							arrive.setHours(0,0,0,0);
							console.log('arrive time: '+arrive.getTime() + ' '+arrive.toDateString());
							console.log('today time: '+today.getTime() + ' '+today.toDateString());
							if(arrive.getTime() >= today.getTime()) {
								returnOnlyFutureFlights.push(flightListFromCache[i]);
							} else {
								//shouldn't break here because sometimes the api responded with weird date shit
								//like -1 as a arrival time
								//break
							}
						}
						return callback(returnOnlyFutureFlights.reverse());
					}

					for(var i in flightListFromCache) {
						if(flightListFromCache[i].faId == id) {
							return callback(flightListFromCache[i]);
						}
					}
					return callback({error:true});
				} else {
					if(err) {
						console.log('error getting flight data :'+err);
						return callback({error:true});
					} else {
						if(id === undefined){ id = null;}
						getFlightInfoFromFlightAwareAPI(airline,flight_num,function(result,response){
							if(!response.error && result.FlightInfoExResult && 
								result.FlightInfoExResult.flights && result.FlightInfoExResult.flights[0]) {
								var formmatedFlightData = [],
									rawFlightData = result.FlightInfoExResult.flights;
								for(var i in rawFlightData) {
									formmatedFlightData.push(getFormattedFlightInfoResult(rawFlightData[i]));
								}
								
								that.setFlightRequestToCache(airline,flight_num,formmatedFlightData);
								
								that.getFlightData(airline,flight_num,id,callback);

							} else {
								that.setFlightRequestToCache(airline,flight_num,{error:true});
								return callback({error:true});
							}

						});
					}
				}
			});
		};

		return this;
	}
};