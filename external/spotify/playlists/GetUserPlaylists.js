const https = require('https');

const GetUserPlaylists = {
  getRequestOptions : function(userId, authorization) {
    return (
      {
        hostname : 'api.spotify.com',
        path : `/v1/users/${userId}`,
        headers : {
          'Authorization' : `Bearer ${authorization}`
        }
      }
    )
  },

  getUserPlaylists : function(userId, authorization, callback) {
    const requestOptions = this.getRequestOptions(userId, authorization);

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
  },
};

module.exports = GetUserPlaylists;

GetUserPlaylists.getUserPlaylists(122717277, 'BQASdb1HOl_NUBm13b77BgAZh3kBi83gys9gxSKWZKD8Z63BL4O7cjj254PkicK79TG4okdm1UrOgXj40YQ8yQ-9cLO-JT0pRT_pthP3DXRa2AoUsASd0jx3A07z_tm-2mYxhEDDcvfy6BCQ',
(err, res) => {
  if(err) {
    console.log(err);
  } else {
    console.log(res);
  }
})