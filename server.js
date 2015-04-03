var express = require("express"),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path'),
	userDb = require('./userDb'),
	router = express.Router();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(__dirname ));

router.route('/')
	.get(userDb.findUser)
	.put(userDb.updateUser);

app.use('/benchmark', router);

app.listen(8080);
console.log('listen on 8080');
