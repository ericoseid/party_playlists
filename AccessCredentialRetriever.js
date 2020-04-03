const http = require('https');
const encode = require('querystring');

function getAccessCredentials(authCode) {
	
	const postData = encode.stringify({
		grant_type : 'authorization_code',
		code : authCode,
		redirect_uri : 'http://127.0.0.1:3002/test',
		client_id : '90bb1e9b33d9402b887b698376c36715',
		client_secret : '7cab6eb568bc4a41afb28f8d3d3a0670'
	});

	const options = {
		hostname : 'accounts.spotify.com',
		path : '/api/token',
		method : 'POST',
		headers: {
    	'Content-Type': 'application/x-www-form-urlencoded',
    	'Content-Length': postData.length
  	}
	};

	const request = http.request(options, (res) => {
		res.setEncoding('utf8');
  	res.on('data', (chunk) => {
    	console.log(`BODY: ${chunk}`);
  	});
  	res.on('end', () => {
    	console.log('No more data in response.');
  	});	
	});

	request.on('error', (e) => {
  	console.error(`problem with request: ${e.message}`);
	});

	request.write(postData);
	request.end();
}

module.exports.getAccessCredentials = getAccessCredentials;


