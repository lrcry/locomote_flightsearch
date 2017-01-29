/**
 * airline-service.js
 * Airline services
 */

let airlineDao = require('../daos/airline-dao');

let getAllAirlinesList = (res) => {
	let resJson = { 'success': false };

	airlineDao.findAll()
		.then((airlinesList) => {
			resJson.success = true;
			resJson.data = airlinesList;
			resJson.msg = 'Airlines got.';
			return res.json(resJson);
		}).catch((e) => {
			resJson.msg = e.message;
			return res.json(resJson);
		}).done();
}

module.exports = {
	getAllAirlinesList: getAllAirlinesList
}