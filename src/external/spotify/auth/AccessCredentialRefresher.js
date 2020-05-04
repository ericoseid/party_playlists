const https = require('https');
const encode = require('querystring');

const AccessCredentialRefresher = {
  appCredentials :
    '90bb1e9b33d9402b887b698376c36715:7cab6eb568bc4a41afb28f8d3d3a0670',

  generatePostData : function(refreshToken) {
    return (
      encode.stringify(
        {
          grant_type : 'refresh_token',
          refresh_token : refreshToken
        }
      )
    );
  },

  generateRequestOptions : function(postData) {
    return (
      {
        hostname : 'accounts.spotify.com',
        path : '/api/token',
        method : 'POST',
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length' : postData.length,
          'Authorization' : `Basic ${Buffer.from(this.appCredentials).toString('base64')}`
        }
      }
    );
  },

  refreshAccessCredentials : function(refreshToken) {
    const postData = this.generatePostData(refreshToken);

    const requestOptions = this.generateRequestOptions(postData);

    return new Promise((resolve, reject) => {
      const request = https.request(requestOptions, (res) => {
        res.setEncoding('utf8');

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      request.on('error', (e) => {
        reject(e);
      });

      request.write(postData);
      request.end();
    });
  }
};

module.exports = AccessCredentialRefresher;
