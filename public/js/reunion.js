$(document).ready(function(){
	var depart_moment = moment(depart_time,'h:mm A'),
	arrive_moment = moment(arrive_time,'h:mm A');
	var time_to_arrival_container = $("#time-to-arrival"),
	flight_progress_bar = $("#flight-progress-bar");

	$("#depart-time-display").text(depart_moment.format('h:mm A'));
	$("#arrive-time-display").text(arrive_moment.format('h:mm A'));
	
	var trip_time = arrive_moment.diff(depart_moment,'hours');
	var progressBar_container = $('.progress-bar');

	var setProgressBarToArrival = function() {
		var traveled_time = moment().diff(depart_moment,'hours'),
			percent_traveled = 0;

		if(traveled_time > 0 && trip_time != 0) {
			percent_traveled = (traveled_time/trip_time) * 100;
		}

		flight_progress_bar.css('width',percent_traveled+'%').attr('aria-valuenow',percent_traveled);
		if(percent_traveled > 0) {
			progressBar_container.removeClass('left');
		}
	};
	var setCountDownToArrivalTimer = function() {
		var now = moment();
		var time_to_arrival_seconds = arrive_moment.diff(now,'seconds');
		function pad(num, size) {
		    var s = num+"";
		    while (s.length < size) s = "0" + s;
		    return s;
		}
		if(time_to_arrival_seconds > 1) {
			time_to_arrival_hours = Math.floor(time_to_arrival_seconds/(60*60));
			time_to_arrival_minutes = Math.floor((time_to_arrival_seconds - (time_to_arrival_hours * 60 * 60))/60);
			time_to_arrival_sec = Math.floor(time_to_arrival_seconds - (time_to_arrival_minutes*60) - (time_to_arrival_hours*60*60));
			if(time_to_arrival_hours > 0) {
				time_to_arrival_container.text(
					pad(time_to_arrival_hours,2) + ':' +
					pad(time_to_arrival_minutes,2)
				);
			} else {
				time_to_arrival_container.text(
					pad(time_to_arrival_minutes,2) + ':' +
					pad(time_to_arrival_sec,2)
				);
			}
		} else {
			time_to_arrival_container.text('Arrived!');
		}
	};
	
	//load the bars/time
	setProgressBarToArrival();
	setCountDownToArrivalTimer();

	var interval = setInterval(function(){
		setCountDownToArrivalTimer();
		setProgressBarToArrival();
	},1000);
})