/****************************************************************
 ****************************************************************
 * Constants
 ****************************************************************
 ****************************************************************/

const apiUrlBase = 'http://localhost:3000/api/v1/';
const apiUrlAirlines = apiUrlBase + 'airlines/';
const apiUrlAirports = apiUrlBase + 'airports/';
const apiUrlSearch = apiUrlBase + 'search/';

/****************************************************************
 ****************************************************************
 * Search form input
 ****************************************************************
 ****************************************************************/

$(document).ready(function() {
	$departureDateInput = $('.form-control[name="departureDate"]');
	$departureDateInput.datepicker();
});

$('.input-airport-city').bind('enterKey', function(e, $inputElement, inputName, inputTitle, inputCity) {
	// query airports
	if (!inputCity) {
		alert('Please enter ' + inputTitle);
		return;
	}

	$.ajax({
		'method': 'get',
		'url': apiUrlAirports + '?city=' + inputCity,
		'success': function(data) {
			if (!data.success) {
				alert('Failed to query airport');
				return;
			}

			$inputHintElement = $inputElement.siblings('.input-hint');
			$inputHintElement.children().remove();
			for (i = 0; i < data.data.length; ++i) {
				$inputHintElement.append('<p class="airport-item" airport-item="' + data.data[i].airportCode + '">' 
					+ data.data[i].airportName 
					+ ' (' + data.data[i].cityName
					+ ', ' + data.data[i].countryName
					+ ')</p>');
			}
			$inputHintElement.append('<a class="close-hint text-align-right">Close</a>');
			$closeHintElement = $inputHintElement.children('.close-hint');
			$inputHintElement.css('display', 'block');
			$inputHintElement.children('.airport-item').on('click', function() {
				$inputElement.val($(this).text());
				$inputElement.attr('airport', $(this).attr('airport-item'));
				$inputHintElement.css('display', 'none');
			})
			$closeHintElement.on('click', function() {
				$inputHintElement.css('display', 'none');
			});
		},
		'error': function(err) {
			console.error(err);
		}
	})
})

$('.input-airport-city').on('keyup', function(e) {
	if (e.keyCode == 13) {
		$(this).trigger('enterKey', [ $(this), $(this).attr('name'), $(this).attr('title'), $(this).val() ]);
	}
})

$('.input-airport-city').on('input', function(e) {
	$(this).siblings('.input-hint').css('display', 'none');
})

$('.form-control').on('change', function(e) {
	$(this).removeClass('input-invalid');
})

/****************************************************************
 ****************************************************************
 * Search form button
 ****************************************************************
 ****************************************************************/

$('#btnSearch').on('click', function() {
	valiForm = validateSearchForm();
	if (valiForm) {
		alert(valiForm);
		return;
	}

	date = new Date($('.form-control[name="departureDate"]').val());
	formattedDate = $.datepicker.formatDate('yy-mm-dd', date);
	$('.wrapper-results').attr('queryDate', formattedDate);

	$('.loading-overlay').css('display', 'block');
	$.ajax({
		'method': 'get',
		'url': apiUrlSearch 
			+ '?from=' + $('.form-control[name="fromCity"]').attr('airport')
			+ '&to=' + $('.form-control[name="toCity"]').attr('airport')
			+ '&date=' + formattedDate,
		'success': function(data) {
			renderSearchResults(data, formattedDate, formattedDate);
		},
		'error': function(e) {
			console.error(e);
		}
	})
})

$('#btnReset').on('click', function() {
	$('.form-control').val('').removeClass('input-invalid');
	$('.form-control.input-airport-city').attr('airport', '');
})

$('#beforeAfterFiveDays').on('click', '.date-item', function() {
	console.log($(this));
	$('.date-item').removeClass('active');
	$thisDay = $(this);
	$('.loading-overlay').css('display', 'block');
	$.ajax({
		'method': 'get',
		'url': apiUrlSearch 
			+ '?from=' + $('.form-control[name="fromCity"]').attr('airport')
			+ '&to=' + $('.form-control[name="toCity"]').attr('airport')
			+ '&date=' + $(this).attr('date'),
		'success': function(data) {
			renderSearchResults(data, $('.wrapper-results').attr('queryDate'), $thisDay.attr('date'));
		},
		'error': function(e) {
			console.error(e);
		}
	});
})

validateSearchForm = function() {
	$inputFromCity = $('.form-control[name="fromCity"]');
	$inputToCity = $('.form-control[name="toCity"]');
	$inputDepartureDate = $('.form-control[name="departureDate"]');

	if (!$inputFromCity.val() || !$inputFromCity.attr('airport')) {
		$inputFromCity.addClass('input-invalid');
		return 'Please select the departure airport';
	}

	if (!$inputToCity.val() || !$inputToCity.attr('airport')) {
		$inputToCity.addClass('input-invalid');
		return 'Please select the arrival airport';
	}

	if (!$inputDepartureDate.val()) {
		$inputDepartureDate.addClass('input-invalid');
		return 'Please choose the date of your departure';
	}
}

renderSearchResults = function(data, queryDay, currDay) {
	dateRange = [];
	dateRangeStart = new Date(queryDay);
	dateRangeStart.setDate(date.getDate() - 2);
	for (i = 0; i < 5; ++i) {
		dateRange.push($.datepicker.formatDate('yy-mm-dd', dateRangeStart));
		dateRangeStart.setDate(dateRangeStart.getDate() + 1);
	}

	$('.loading-overlay').css('display', 'none');
	$fiveDayElement = $('#beforeAfterFiveDays');
	$fiveDayElement.children().remove();
	fiveDayTab = '<h4>';
	for (i = 0; i < dateRange.length; ++i) {
		fiveDayTab += '<a class="date-item ' + ((currDay == dateRange[i]) ? 'active' : '') + '" date="' + dateRange[i] + '">' + dateRange[i] + '</a>';
	}
	fiveDayTab += '<span>' + ((data.count && data.count > 0) ? (data.count + ' flight' + ((data.count > 1) ? 's' : '')) : '0 flight') + ' found' + '</span>';
	fiveDayTab += '</h4>';
	$fiveDayElement.append(fiveDayTab);

	$flightResultElement = $('#flightResult');
	$flightResultElement.children().remove();
	$flightResultElement.append('<hr class="separator"/>');
	result = data.data;
	if (result) {
		for (i = 0; i < result.length; ++i) {
			startDate = new Date(result[i].start.dateTime);
			startDateStr = $.datepicker.formatDate('yy-mm-dd', startDate);
			startDay = startDateStr;
			startTimeStr = (startDate.getHours() < 10) ? ('0' + startDate.getHours()) : startDate.getHours();
			startTimeStr += ':';
			startTimeStr += (startDate.getMinutes() < 10) ? ('0' + startDate.getMinutes()) : startDate.getMinutes();
			startDateStr += ' ' + startTimeStr;
			endDate = new Date(result[i].finish.dateTime);
			endDateStr = $.datepicker.formatDate('yy-mm-dd', endDate);
			endDay = endDateStr;
			endTimeStr = (endDate.getHours < 10) ? ('0' + endDate.getHours()) : endDate.getHours();
			endTimeStr += ':';
			endTimeStr += (endDate.getMinutes() < 10) ? ('0' + endDate.getMinutes()) : endDate.getMinutes();
			endDateStr += ' ' + endTimeStr;
			$flightResultElement.append(
				'<div class="row flight-item">' + 
					'<div class="col-xs-12 col-md-2">' +
						'<h4 class="text-bold">' + result[i].airline.code + ' ' + result[i].flightNum + '</h4>' +
						'<p>' + result[i].airline.name + '</p>' +
					'</div>' +
					'<div class="col-xs-12 col-md-3">' +
						'<h4>' + startTimeStr + ' to ' + endTimeStr 
							+ ((startDay == endDay) ? '' : ' (+1 day)') 
							+ '</h4>' + 
						'<h5>' + result[i].start.airportCode 
							+ ' - ' + result[i].finish.airportCode + ', ' + ((result[i].durationMin / 60 > 0) ? ((result[i].durationMin / 60).toFixed(0) + 'h') : '') + (result[i].durationMin % 60) + 'm' + '</h5>' +
					'</div>' +
					'<div class="col-xs-12 col-md-5">' +
						'<p class="text-gray">Depart at ' + startDateStr
							+ ', ' + result[i].start.airportName 
							+ ' (' + result[i].start.airportCode + '), '
							+ result[i].start.cityName + '</p>' +
						'<p class="text-gray">Arrive at ' + endDateStr
							+ ', ' + result[i].finish.airportName
							+ ' (' + result[i].finish.airportCode + '), ' 
							+ result[i].finish.cityName + '</p>' +
					'</div>' +
					'<div class="col-xs-12 col-md-2">' + 
						'<h3 class="text-bold" style="margin-top: 0 !important;">AU$ ' + result[i].price.toFixed(2) + '</h3>' +
					'</div>' +
				'</div>'
			);
		}
	} else {
		$flightResultElement.append('<h4>Could not find any flights</h4>');
	}
};