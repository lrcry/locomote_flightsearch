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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// serve static files
app.use('/', express.static(__dirname + '/public_html'));

// api endpoints router definition

router.route('/airlines')
.get((req, res) => {
	res.json({
		'msg': 'hello airlines'
	})
});

router.route('/airports')
.get((req, res) => {
	res.json({
		'msg': 'hello airports'
	})
});

router.route('/search')
.get((req, res) => {
	res.json({
		'msg': 'hello search'
	})
})

// apply api router
app.use('/api/v1', router);
app.listen(3000);
