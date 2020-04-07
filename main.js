const {retrieveAndStoreAuthorizationData} = require('./tasks/RetrieveAndStoreAuthorizationData.js');
const express = require('express');
const app = express();

// app.get('/get_user', (req, res) => {
// 	res.append('Access-Control-Allow-Origin', '*');
//
// 	const thing = new UsersDao();
//
// 	thing.getUserInfo(req.query.name);
//
// 	thing.on('row', (row) => {
// 		const ret = [];
// 		if (row) {
// 			ret.push(row);
// 		}
//
// 		res.send(ret);
// 	});
// });
//
// app.get('/get_user_info', (req, res) => {
// 	res.append('Access-Control-Allow-Origin', '*');
//
// 	const getUserInfoHandler = new GetUserInfoHandler();
// 	const userInfoRetriever = new UserInfoRetriever();
//
// 	getUserInfoHandler.handle(req.query.user, (err, response) => {
// 		if (err){
// 			res.send({status : 'failure'});
// 		} else {
// 			res.send(response);
// 		}
// 	})
// });

app.get('/authorize_user', (req, res) => {
	res.append('Access-Control-Allow-Origin', '*');

	const state = JSON.parse(req.query.state);

	retrieveAndStoreAuthorizationData(state.user, req.query.code, (err) =>{
		if (err) {
			console.log(err);
		} else {
			console.log('done');

		}
		res.send('fuck ass');
	});
});

app.listen(3001);
