const db = require('mysql');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 
    `UPDATE user_data SET spotify_id=?, auth_token=?, 
    refresh_token=? WHERE user_name=?;`;

const updateUserInfoWithSpotifyInfo = 
  (user_name, spotify_id, auth_token, refresh_token) => {
    const connection = db.createConnection(CONNECTION_INFO);

    const queryParams = [spotify_id, auth_token, refresh_token, user_name]; 
    console.log(queryParams);
    return new Promise((resolve, reject) => {
      connection.query(QUERY_STRING, queryParams, (err) => {
        connection.destroy();

        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

module.exports.updateUserInfoWithSpotifyInfo = updateUserInfoWithSpotifyInfo;