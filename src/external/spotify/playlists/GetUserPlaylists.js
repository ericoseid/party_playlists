const https = require('https');

const getUserPlaylists = (userId, accessToken) => {
  const requestOptions = {
    hostname : 'api.spotify.com',
    path : `/v1/users/${userId}/playlists` ,
    headers : {
      'Authorization' : `Bearer ${accessToken}`
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.get(requestOptions, (res) => {
      res.setEncoding('utf8');
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', (err) => {
      reject(err);
    });
  });
};

module.exports.getUserPlaylists = getUserPlaylists;
