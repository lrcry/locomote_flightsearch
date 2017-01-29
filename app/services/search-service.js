/**
 * search-service.js
 * Flight serch services
 */

let airlineDao = require('../daos/airline-dao');
let searchDao = require('../daos/search-dao');

let searchFlights = (fromLocation, toLocation, travelDate, res) => {
	let resJson = { success: false };
	let flightResult = [];
	let count = 0;
	airlineDao.findAll()
		.then((allAirlinesList) => {
			for (let i = 0; i < allAirlinesList.length; ++i) {
				searchDao.findByQuery(
					allAirlinesList[i].code, 
					travelDate, 
					fromLocation, 
					toLocation).then((searchResultsList) => {
						++count;
						flightResult = flightResult.concat(searchResultsList);
						if (count >= allAirlinesList.length) {
							// sort by price
							flightResult.sort((a, b) => {
								return a.price - b.price;
							});

							// respond
							resJson.success = true;
							resJson.data = flightResult;
							resJson.msg = 'Flights found.';
							resJson.count = flightResult.length;
							return res.json(resJson);
						}
					}).catch((e) => {
						console.error(e);
						resJson.msg = e.message;
						return res.json(resJson);
					}).done();
			}
		}).catch((e) => {
			console.error(e);
			resJson.msg = e.message;
			return res.json(resJson);
		}).done();
}

module.exports = {
	searchFlights: searchFlights
}