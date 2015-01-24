$(document).ready(function(){
	var depart_moment = moment(depart_time,'X'),
	arrive_moment = moment(arrive_time,'X');
	if(!depart_time || !arrive_time || depart_time.length == 0 || arrive_time.length == 0) {
		$("#reunion-container").hide();
		$("#reunion-container-error").show();

	}
	$('#error-go-back').click(function(){
		window.location.replace('/');
	});
	var time_to_arrival_container = $("#time-to-arrival"),
	flight_progress_bar = $("#flight-progress-bar"),
	hug_icon_fill = $(".hug-icon-fill");

	$("#depart-time-display").text(depart_moment.format('h:mm A - MMM D'));
	$("#arrive-time-display").text(arrive_moment.format('h:mm A - MMM D'));
	
	
	var progressBar_container = $('.progress-bar');

	var setProgressBarToArrival = function() {
		var traveled_time = moment().diff(depart_moment,'seconds'),
			percent_traveled = 0,
			trip_time = arrive_moment.diff(depart_moment,'seconds');
			// console.log('traveled_time '+traveled_time);
		if(traveled_time > 0 && trip_time != 0) {
			percent_traveled = (traveled_time/trip_time) * 100;
		}
		if(percent_traveled >= 100){
			percent_traveled = 100;
		}

		flight_progress_bar.css('width',percent_traveled+'%').attr('aria-valuenow',percent_traveled);
		hug_icon_fill.css('height',percent_traveled+'%');
		if(percent_traveled > 0) {
			progressBar_container.removeClass('left');
			//here
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
				$("#remaining-time-unit-label").text('Hours');
				time_to_arrival_container.text(
					pad(time_to_arrival_hours,2) + ':' +
					pad(time_to_arrival_minutes,2)
				);
			} else {
				$("#remaining-time-unit-label").text('Minutes');
				time_to_arrival_container.text(
					pad(time_to_arrival_minutes,2) + ':' +
					pad(time_to_arrival_sec,2)
				);
			}
		} else {
			time_to_arrival_container.text('Arrived!');
			$("#remaining-time-text-area").text('');
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


var hammertime = new Hammer(myElement, myOptions);
hammertime.on('pan', function(ev) {
    console.log(ev);
});


