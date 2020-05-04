const https = require('https');

const AddTrackToPlaylistCaller = {
  call : function (requestObject) {
    this.validateRequest(requestObject); 

    const {playlistId, trackUri, authToken} = requestObject;

    const requestBody = JSON.stringify({uris : [trackUri]});

    const requestOptions = this.buildRequestOptions(playlistId, authToken);
   
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

      request.on('err', (err) => {
        reject(err);
      });

      request.write(requestBody);
      request.end();
    });
  },

  validateRequest : function (requestObject) {
    if (!requestObject.playlistId) {
      throw('Playlist ID is required');
    } else if (!requestObject.trackUri) {
      throw('Track URI is required');
    } else if (!requestObject.authToken) {
      throw('Auth Token is required');
    }
  },

  buildRequestOptions : function (playlistId, authToken) {
    return ({
      hostname : 'api.spotify.com',
      path : `/v1/playlists/${playlistId}/tracks`,
      method : 'POST',
      headers : {
        'Authorization' : `Bearer ${authToken}`,
        'Content-Type' : 'application/json'
      }
    });
  }
}

module.exports = AddTrackToPlaylistCaller;
