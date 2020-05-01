const http = require('https');
const encode = require('querystring');

function generatePostData(authCode) {
	return (
		encode.stringify(
			{
				grant_type : 'authorization_code',
				code : authCode,
				redirect_uri : 'http://127.0.0.1:3000/CompleteAccount',
				client_id : '90bb1e9b33d9402b887b698376c36715',
				client_secret : '7cab6eb568bc4a41afb28f8d3d3a0670'
			}
		)
	);
}

function generateRequestOptions(postData) {
	return (
		{
			hostname : 'accounts.spotify.com',
			path : '/api/token',
			method : 'POST',
			headers: {
    		'Content-Type': 'application/x-www-form-urlencoded',
    		'Content-Length': postData.length
  		}
		}
	);
}

function retrieveAccessCredentials(authCode, callback) {
	const postData = generatePostData(authCode);

	const options = generateRequestOptions(postData);

	const request = http.request(options, (res) => {
		res.setEncoding('utf8');

		let data = '';
  	res.on('data', (chunk) => {
    	data += chunk;
  	});

  	res.on('end', () => {
    	setImmediate(callback, undefined, JSON.parse(data));
  	});
	});

	request.on('error', (e) => {
  	setImmediate(callback, e, undefined);
	});

	request.write(postData);
	request.end();
}

module.exports.retrieveAccessCredentials = retrieveAccessCredentials;
