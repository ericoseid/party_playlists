const https = require('https');

class UserInfoRetriever {
  retrieve(access_token, callback) {
    const options = {
      hostname : 'api.spotify.com',
      path : '/v1/me',
      method : 'GET',
      headers : {
        'Authorization' : `Bearer ${access_token}`
      }
    };

    const request = https.get(options, (res) => {
      if (res.statusCode == '401') {
        setImmediate(callback, '401', undefined);
      } else {
        setImmediate(callback, undefined, res);
      }
    });

    request.on('error', (e) => {console.log(e)});
  }
}

module.exports.UserInfoRetriever = UserInfoRetriever;
