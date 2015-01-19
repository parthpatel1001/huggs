$(document).ready(function(){
	$('#submit-look-up-flight').click(function(e){
		e.preventDefault();
		// $.ajax({
		// 	url: '/flights',
		// 	data: {

		// 	}
		// });
	});


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
	      if (substrRegex.test(airline.airline_name)) {
	        // the typeahead jQuery plugin expects suggestions to a
	        // JavaScript object, refer to typeahead docs for more info
	        matches.push(airline);
	      }
	    });
	 
	    cb(matches);
	  };
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
	
	$('.airline-input-js').typeahead({
	  hint: true,
	  highlight: true,
	  minLength: 1
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

	$('.airline-input-js').on('typeahead:selected',function(){
		$('.flight-number').css('visibility','visible');
		$( ".flight-number" ).focus();
	});

	$('.airline-input-js').on("input", function() {
		if($(this).val().length > 0){}
		else{
			$('.flight-number').css('visibility','hidden');
			$('#submit-look-up-flight').css('visibility','hidden');
		}
	});


	$('.flight-number').on("input", function() {
		if($(this).val().length > 0){
			$('#submit-look-up-flight').css('visibility','visible');
		}
		else{
			$('#submit-look-up-flight').css('visibility','hidden');
		}
	});

	$('#submit-look-up-flight').click(function(){
		$("#huggs-form").submit();
	}); 
})







