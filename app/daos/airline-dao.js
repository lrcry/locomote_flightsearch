/**
 * airline-dao.js
 * DAO layer for airlines
 */

let http = require('http');
const flightApiAirlines = process.env.flightApiBase + process.env.flightApiAirlines;
let Promise = require('q').Promise;

let findAll = () => {
	return new Promise((resolve, reject) => {
		http.get(flightApiAirlines, (res) => {
			let body = '';

			if (res.statusCode < 200 || res.statusCode > 299) {
				reject(new Error('Failed to load airlines, [HTTP ' + res.statusCode + ']'));
			}

			res.on('data', (chunk) => {
				body += chunk;
			})

			res.on('end', () => {
				try {
					let data = JSON.parse(body);
					resolve(data);
				} catch (e) {
					reject(e);
				}
			})
		}).on('error', (e) => {
			console.error(e);
			reject(e);
		})
	})
}

module.exports = {
	findAll: findAll
}