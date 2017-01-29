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

	$('.loading-overlay').css('display', 'block');
	setTimeout(function() {
		$('.loading-overlay').css('display', 'none');
	}, 3000);
})

$('#btnReset').on('click', function() {
	$('.form-control').val('').removeClass('input-invalid');
	$('.form-control.input-airport-city').attr('airport', '');
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