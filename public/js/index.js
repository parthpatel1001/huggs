$(document).ready(function(){
	var airlineInput = $('#airline'),
		flightNumInput = $('#flight_num'),
		submitLookUpFlightButton = $('#submit-look-up-flight'),
		hugsForm = $("#huggs-forms"),
		flightResultList = $("#flight-result-list"),
		flightResultListErrorMessage = $('#result-error-message'),
		flightId = $("#id"),
		validAirlineSelected = false,
		waitingForListOfFlights = false,
		selectedFlightDate = false;
	
	function is_touch_device() {
	 return (('ontouchstart' in window)
	      || (navigator.MaxTouchPoints > 0)
	      || (navigator.msMaxTouchPoints > 0));
	}

	var substringMatcher = function(airlines_list) {
	  return function findMatches(q, cb) {
	    var matches, substrRegex;
	 
	    // an array that will be populated with substring matches
	    matches = [];
	 
	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');
	 
	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(airlines_list, function(i, airline) {
	      if (substrRegex.test(airline.airline_name) || substrRegex.test(airline.symbol)) {
	        // the typeahead jQuery plugin expects suggestions to a
	        // JavaScript object, refer to typeahead docs for more info
	        matches.push(airline);
	      }
	    });
	 
	    cb(matches);
	  };
	};	
	
	var showIfValid = function(isValid,elements,hideOtherwiseElements,then) {
		if(!(elements instanceof Array)) { elements = [elements]; }
		if(isValid()) {
			for(var i in elements) { elements[i].css('visibility','visible'); } // ask joe if css display:none -> jquery show/hide is ok in css
		} else if(hideOtherwiseElements !== undefined) {
			if(!(hideOtherwiseElements instanceof Array)) { hideOtherwiseElements = [hideOtherwiseElements]; }
			for(var i in elements) { hideOtherwiseElements[i].css('visibility','hidden'); }
		}
		if(then !== undefined) { then(elements); }
	};
	var hideIfInvalid = function(isValid,elements,showOtherwiseElements) {
		if(!(elements instanceof Array)) { elements = [elements]; }
		if(isValid()) {
			for(var i in elements) { elements[i].css('visibility','visible'); } // ask joe if css display:none -> jquery show/hide is ok in css
		} else if(showOtherwiseElements !== undefined) {
			if(!(showOtherwiseElements instanceof Array)) { showOtherwiseElements = [showOtherwiseElements]; }
			for(var i in elements) { showOtherwiseElements[i].css('visibility','hidden'); }
		}
	};
	var isAirlineInputValid = function() {
		return validAirlineSelected && airlineInput.val().length > 0;
	};
	var isFlightNumInputValid = function() {
		return flightNumInput.val().length > 0;
	};
	var isValidFlightNumDateSelected = function() {
		return selectedFlightDate;
	};
	var giveFocusTo = function(element,removeBlinkerClass) {
		if(removeBlinkerClass !== undefined) { 
			removeBlinkerClass.removeClass('border-left-blink');
		}
		element.focus();
	};

	var selectFlightDate = function() {
		$(this).addClass('flight-date-selected');
		var idFound = $(this).find('.result-flight-id-js').text();
		window.location.href = '/reunion?airline='+airlineInput.val()+'&flight_num='+flightNumInput.val()+'&id='+idFound;
	};	

	var setFlightResultList = function() {
		if(!waitingForListOfFlights) {
			waitingForListOfFlights = true;
			$.ajax({
				dataType: 'JSON',
				type: 'GET',
				url: '/flights',
				data: {
					airline : airlineInput.val(),
					flight_num : flightNumInput.val()
				},
				success: function(response) {
					flightResultList.empty();
					if(response.error || response.length == 0) {
						flightResultListErrorMessage.text('No flights found');
						return;
					}
					flightResultListErrorMessage.css('display','none');
					for(var i in response) {
						var departTimeMoment =moment(response[i].depart_time,'X'),
							arriveTimeMoment = moment(response[i].arrive_time,'X'),
							
							departTimeDayOfWeek = departTimeMoment.format('ddd'),
							departTimeDayOfMonth = departTimeMoment.format('D'),
							departAirport = response[i].from_airport,

							arriveTimeDayOfWeek = arriveTimeMoment.format('ddd'),
							arriveTimeDayOfMonth = arriveTimeMoment.format('D'),
							arriveAirport = response[i].dest_airport;
							


						var disp =  '<h3>'+arriveTimeDayOfWeek+'</h3> '+'<h2>'+arriveTimeDayOfMonth+'</h2> ';
							// disp += '<span>'+departTimeDayOfWeek+'</span> '+'<span>'+arriveTimeDayOfMonth+'</span> '+'<span>'+arriveAirport+'</span> ';
							disp += '<span style="visibility:hidden;" class="result-flight-id-js">'+response[i].faId+'</span>';

						var li = $('<li class="result-flight-js">'+disp+'</li>');

						flightResultList.append(li);
						
						li.click(selectFlightDate);
						

					}
				},
				error: function(response) {
					flightResultList.empty();
					flightResultListErrorMessage.text('No flights found');
					selectedFlightDate = false;
				},
				complete: function() {
					waitingForListOfFlights = false;
				}
			});
		}
	};



	airlineInput.typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1,
	  autoselect: true
	},
	{
	  name: 'airports',
	  displayKey: 'symbol',
	  source: substringMatcher(airlines),
	  templates: {
		empty: [
			'<p class="typeahead-empty-message">',
			'Unable to find any airlines that match the current query',
			'</p>'
		].join('\n'),
		suggestion: Handlebars.compile('<p class = "airline-list">{{airline_name}} – {{symbol}}</p>')
	  }
	});

	/*
	 * airline input events
	 */
	airlineInput.on('typeahead:selected',function(){
		validAirlineSelected = true;
	}).on('typeahead:opened',function(){
		validAirlineSelected = false;
		flightNumInput.css('visibility','hidden');
		// submitLookUpFlightButton.css('visibility','hidden');
	}).on('typeahead:closed',function(){
		if(isAirlineInputValid()) {
			flightNumInput.css('visibility','visible');
			giveFocusTo(flightNumInput, $('.airline-input-js'));
		}
	});

	airlineInput.keypress(function(e) {
		if(airlineInput.val().length > 0) {
			$('.airline-input-js').removeClass('border-left-blink');
		} else {
			$('.airline-input-js').addClass('border-left-blink');
		}
		if(e.which == 13 || e.which == 9) {
			e.preventDefault();
		}
	});

	airlineInput.blur(function(){
		if(airlineInput.val().length > 0) {
			$('.airline-input-js').removeClass('border-left-blink');
		} else {
			$('.airline-input-js').addClass('border-left-blink');
			$(this).attr('placeholder'," Enter Airline");
		}
		flightResultListErrorMessage.css('display','block');
	});

	airlineInput.focus(function(){
		//when the element is focused, take away the placeholder, but only if nothing is typed inside
		if(airlineInput.val().length > 0) {
			$(this).attr('placeholder',"");
		}
		$('.airline-input-js').removeClass('border-left-blink');
		
		flightResultListErrorMessage.css('display','none');
	});
	airlineInput.click(function(){
		//if you proactively click into the element, take away the place holder
		$(this).attr('placeholder',"");
		$('.airline-input-js').removeClass('border-left-blink');
	});
	
	if (!is_touch_device()) {
		airlineInput.focus();
	}
	
	/*
	 * flight number input events
	 */
	flightNumInput.focus(function(){
		flightResultList.empty();
		flightResultListErrorMessage.css('display','none');
	});

	flightNumInput.blur(function() {
		setFlightResultList();
		flightResultListErrorMessage.css('display','block');
	});

	flightNumInput.keypress(function(e) {
		//dont submit the form if you press enter or submit
		if(e.which == 13 || e.which == 9) {
			e.preventDefault(); //leave the input, which will trigger the list to appear
			flightNumInput.blur();
		}
	});

})
