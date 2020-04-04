const {AccessCredentialRetriever} = require('./AccessCredentialRetriever.js');
const {UsersDao} = require('./UsersDao.js');
const {UserAuthorizationDataDao} = require('./UserAuthorizationDataDao.js');
const express = require('express');
const app = express();

app.get('/get_user', (req, res) => {
	res.append('Access-Control-Allow-Origin', '*');

	const thing = new UsersDao();

	thing.getUserInfo(req.query.name);

	thing.on('row', (row) => {
		res.send(row);
	});
});

app.get('/authorize_user', (req, res) => {
	res.append('Access-Control-Allow-Origin', '*');

	const accessCredentialRetriever = new AccessCredentialRetriever();

	const state = JSON.parse(req.query.state);

	accessCredentialRetriever.retrieveAccessCredentials(req.query.code);

	accessCredentialRetriever.on('reponse', (data) => {
		const userAuthorizationDataDao = new UserAuthorizationDataDao();

		userAuthorizationDataDao.storeAutorizationInfo(state.user,
																									 data.access_token,
																									 data.refresh_token);

		userAuthorizationDataDao.on('complete', () => {
			res.send('');
		})
	})

});

app.listen(3001);
