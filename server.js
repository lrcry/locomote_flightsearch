/**
 * server.js
 * main server script
 */

let express = require('express');
let app = express();
let router = express.Router();

let bodyParser = require('body-parser');
let cors = require('cors');
let url = require('url');

let airlineService = require('./app/services/airline-service');
let airportService = require('./app/services/airport-service');
let searchService = require('./app/services/search-service');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// serve static files
app.use('/', express.static(__dirname + '/public_html'));

// api endpoints router definition

router.route('/airlines')
.get((req, res) => {
	airlineService.getAllAirlinesList(res);
});

router.route('/airports')
.get((req, res) => {
	airportService.queryAirport(req, res);
});

router.route('/search')
.get((req, res) => {
	searchService.searchFlights(
		req.query.from,
		req.query.to,
		req.query.date,
		res);
})

// apply api router
app.use('/api/v1', router);
app.listen(3000);
