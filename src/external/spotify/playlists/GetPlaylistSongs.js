const https = require('https');

const getPlaylistSongs = (playlistId, authToken) => {
  const requestOptions = {
    hostname : 'api.spotify.com',
    path: `/v1/playlists/${playlistId}/tracks`,
    headers : {
      'Authorization' : `Bearer ${authToken}`
    }
  }

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
    })
  });
}

module.exports.getPlaylistSongs = getPlaylistSongs;

