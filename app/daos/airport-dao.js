/**
 * airport-dao.js
 * DAO layer for airports
 */

let http = require('http');
const flightApiAirports = process.env.flightApiBase + process.env.flightApiAirports;
let Promise = require('q').Promise;

let findByCityName = (cityName) => {
	return new Promise((resolve, reject) => {
		http.get(flightApiAirports + '?q=' + cityName, (res) => {
			let body = '';

			if (res.statusCode < 200 || res.statusCode > 299) {
				reject(new Error('Failed to load airports, [HTTP ' + res.statusCode + ']'));
			}

			res.on('data', (chunk) => {
				body += chunk;
			})

			res.on('end', () => {
				try {
					let data = JSON.parse(body);
					resolve(data);
				} catch (e) {
					console.error(e);
					reject(e);
				}
			})
		})
	})
}

module.exports = {
	findByCityName: findByCityName
}