const https = require('https');

const UserDataRetriever = {
  buildRequestOptions : function(accessToken) {
    return (
      {
        hostname : 'api.spotify.com',
        path : '/v1/me',
        headers : {
          'Authorization' : `Bearer ${accessToken}`
        }
      }
    );
  },

  getUserData : function(accessToken, callback) {
    const requestOptions = this.buildRequestOptions(accessToken);

    const request = https.get(requestOptions, (res) => {
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
  }
};

module.exports = UserDataRetriever;