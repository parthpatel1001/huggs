$(document).ready(function(){
	var airlineInput = $('#airline'),
		flightNumInput = $('#flight_num'),
		submitLookUpFlightButton = $('#submit-look-up-flight'),
		hugsForm = $("huggs-forms"),
		validAirlineSelected = false;

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
	var giveFocusTo = function(element,removeBlinkerClass) {
		if(removeBlinkerClass !== undefined) { 
			removeBlinkerClass.removeClass('border-left-blink');
		}
		element.focus();
	};
	// var airports = [];

	// var airports = new Bloodhound({
	//   datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	//   queryTokenizer: Bloodhound.tokenizers.whitespace,
	//   // limit: 500,
	//   local: $.map(airports, function(airport) { return { value: airport }; }),
	//   prefetch:{
	//   	url : '/airports',
	//   	filter: function(list) {
	//   		return $.map(list,function(airport){ return {value: airport}; });
	//   	}
	//   }
	//   // ,
	//   // remote:{
	//   // 	'/airports'
	//   // },
	// });
	// $.ajax(
	// 	dataType: 'JSON',
	// 	url: '/airports',
	// 	success: function(response) {
	// 		console.log('got airports: ');
	// 		console.dir(response);
	// 		airports = response;
	// 	}

	// );
	// airports.initialize();

	
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

	airlineInput.on('typeahead:selected',function(){
		validAirlineSelected = true;
	}).on('typeahead:opened',function(){
		validAirlineSelected = false;
		flightNumInput.css('visibility','hidden');
		submitLookUpFlightButton.css('visibility','hidden');
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
			console.log('key press: ' +e.which);
			e.preventDefault();
		}
	});

	airlineInput.blur(function(){
		if(airlineInput.val().length > 0) {
			$('.airline-input-js').removeClass('border-left-blink');
		} else {
			$('.airline-input-js').addClass('border-left-blink');
		}
	});

	airlineInput.focus(function(){
		$('.airline-input-js').removeClass('border-left-blink');
	});
	airlineInput.focus();
	airlineInput.on("input", function() {
		// hideIfInvalid(isAirlineInputValid,[flightNumInput,submitLookUpFlightButton]);
	});


	flightNumInput.on("input", function() {
		if($(this).val().length > 0){
			submitLookUpFlightButton.css('visibility','visible');
		}
		else{
			submitLookUpFlightButton.css('visibility','hidden');
		}
	});
	


	submitLookUpFlightButton.click(function(){
		hugsForm.submit(function(e){
			if(airlineInput.val().length <= 0 || hugsForm.val().length <= 0) {
				e.preventDefault();
				return false;
			}
		});	
	}); 


})







	