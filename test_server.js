const express = require('express');
const app = express();
const port = 3002;

app.get('/test', function(req, res) {
	console.log(req.query);

	res.send('yeep');
});

app.listen(port);
