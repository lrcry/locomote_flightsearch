/**
 * search-service.js
 * Flight serch services
 */

let searchFlights = (fromLocation, toLocation, travelDate, res) => {
	return res.json({
		'msg': 'search for flights from ' + fromLocation + ', to ' + toLocation + ' on ' + travelDate
	})
}

module.exports = {
	searchFlights: searchFlights
}