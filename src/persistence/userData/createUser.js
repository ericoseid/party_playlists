const db = require('mysql');
const util = require('util');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 
  `INSERT INTO user_data (user_name, user_email, spotify_id, 
  user_password, auth_token, refresh_token, creation_date) 
  VALUES (?, ?, ?, ?, ?, ?, ?);`;

function getQueryValues(data) {
  return [data.user_name, data.user_email, data.spotify_id, data.user_password,
          data.auth_token, data.refresh_token, data.creation_date];
}

function createUser(newUserData) {
  const connection = db.createConnection(CONNECTION_INFO);
  
  const values = getQueryValues(newUserData);

  return new Promise((resolve, reject) => {
    connection.query(QUERY_STRING, values, (err) => {
      connection.destroy();

      if (err) {
        reject(err.errno);
      } else {
        resolve();
      }
    });
  });
}

module.exports.createUser = createUser;
