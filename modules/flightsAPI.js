var redis = require("redis"),
    redisClient = redis.createClient();
  	redisClient.on('error',function(err){
  		console.log(err);
  	});

module.exports = {
	getApiClient : function(){
		this.redisClient = redisClient;

		var that = this;

		var REDIS_KEY_SEPERATOR = '|||',
		    FLIGHT_REQUEST_EXPIRES = 600; //seconds


		var getFlightKeyString = function(airline,flight_num) {
			return airline + REDIS_KEY_SEPERATOR + flight_num;
		};

		this.setFlightRequestToCache = function(airline,flight_num,data) {
			this.redisClient.set(getFlightKeyString(airline,flight_num),JSON.stringify(data));
			this.redisClient.expire('string key', FLIGHT_REQUEST_EXPIRES);
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
						//reach out to the api and 
						that.setFlightRequestToCache(airline,flight_num,'test rand'+Math.random());
						that.getFlightData(airline,flight_num,callback);
						// callback(JSON.stringify('empty'));
					}
				}
			});
		}

		return this;
	}
};