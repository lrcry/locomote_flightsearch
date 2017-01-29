/**
 * airport-service.js
 * Airport services
 */

let queryAirport = (req, res) => {
	return res.json({
		'msg': 'airports list'
	});
};

module.exports = {
	queryAirport: queryAirport
}
