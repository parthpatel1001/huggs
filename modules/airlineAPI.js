var redis = require("redis"),
    redisClient = redis.createClient();
  	redisClient.on('error',function(err){
  		console.log(err);
  	});
var MongoClient = require('mongodb').MongoClient;

module.exports = {
	getApiClient : function(ENVIRONMENT){
		this.getAirlines = function(callback) {
			MongoClient.connect("mongodb://"+ENVIRONMENT.mongo_host, function(err, db) {
				var airlines     = db.collection('airlines'),
					stream       = airlines.find().stream(),
					airlinesList = [];

				stream.on('data',function(item){
					airlinesList.push(item);
				});

				stream.on('end',function(){
					return callback(airlinesList);
				});
			});
		};
		return this;
	}
};