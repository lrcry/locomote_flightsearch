/**
 * airport-service.js
 * Airport services
 */

let airportDao = require('../daos/airport-dao');

let queryAirport = (cityName, res) => {
	let resJson = { success: false };

	airportDao.findByCityName(cityName)
		.then((airportsList) => {
			resJson.success = true;
			resJson.data = airportsList;
			resJson.msg = 'Airports in ' + cityName + ' got';
			return res.json(resJson);
		}).catch((e) => {
			console.error(e);
			resJson.msg = e.message;
			return res.json(resJson);
		}).done();
};

module.exports = {
	queryAirport: queryAirport
}
