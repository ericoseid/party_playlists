const https = require('https');
const encode = require('querystring');

const appCredentials =
  '90bb1e9b33d9402b887b698376c36715:7cab6eb568bc4a41afb28f8d3d3a0670';

const encodedAppCrendentials = Buffer.from(appCredentials).toString('base64');

function generatePostData(refreshToken) {
  return (
    encode.stringify(
      {
        grant_type : 'refresh_token',
        refresh_token : refreshToken
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
    		'Content-Type' : 'application/x-www-form-urlencoded',
    		'Content-Length' : postData.length,
        'Authorization' : `Basic ${encodedAppCrendentials}`
      }
    }
  );
}

function refreshAccessCredentials(refreshToken, callback) {
  const postData = generatePostData(refreshToken);

  const requestOptions = generateRequestOptions(postData);

  const request = https.request(requestOptions, (res) => {
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

module.exports.refreshAccessCredentials = refreshAccessCredentials;
