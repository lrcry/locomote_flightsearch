/**
 * search-dao.js
 * DAO layer for search results
 */

let http = require('http');
const flightApiFlightSearch = process.env.flightApiBase + process.env.flightApiFlightSearch;
let Promise = require('q').Promise;

let findByQuery = (airlineCode, date, fromAirportCode, toAirportCode) => {
	return new Promise((resolve, reject) => {
		let queryUrl = flightApiFlightSearch
			+ airlineCode
			+ '?date=' + date
			+ '&from=' + fromAirportCode
			+ '&to=' + toAirportCode;
		http.get(queryUrl, (res) => {
			let body = '';

			if (res.statusCode < 200 || res.statusCode > 299) {
				reject(new Error('Failed to load flight query, [HTTP ' + res.statusCode +']'));
			}

			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				try {
					let data = JSON.parse(body);
					resolve(data);
				} catch (e) {
					console.error(e);
					reject(e);
				}
			})
		});
	})
}

module.exports = {
	findByQuery: findByQuery
}