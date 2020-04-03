const {getAccessCredentials} = require('./AccessCredentialRetriever.js');
const {UsersDao} = require('./UsersDao.js');
const express = require('express');

//getAccessCredentials('AQB6Vo0a-GrZvQ-tiwQdSKEFU1UelWSgcwQ0K1z1GIOZEoHfu3AJnHGJmKOXqPfDFkJHes-i_wSBTFCnHJ9A1wMvc4wqt5jIdOUgarWAEDU00HRBY8PKljiSJFXBTQZXgZrhXY0Rg14j_uQDXD_GJKxLG_WpZ7Y3RzUUK8qTLNcr1QOI-NIZSpHtehj64pqp');

const app = express();

app.get('/get_user', (req, res) => {

	const thing = new UsersDao();

	thing.getUserInfo(req.query.name);

	thing.on('row', (row) => {
		res.send(row);
	});
});

app.listen(3001);
