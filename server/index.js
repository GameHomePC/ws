var path = require('path');
var express = require('express');

var app = express();

app.use(express.static(path.dirname(__dirname) + '/public/'));

app.get('/', function(req, res){

	res.sendFile('index.html', {
		root: path.dirname(__dirname) + '/views/'
	});

});

app.listen(8000);


require('websocket')(app); // WebSocketServer