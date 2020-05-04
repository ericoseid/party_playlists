const mysql = require('mysql');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 
    `UPDATE user_data SET auth_token=? WHERE user_name=?;`;

const updateAuthToken = (userId, authToken) => {
  const connection = mysql.createConnection(CONNECTION_INFO);

  return new Promise((resolve, reject) => {
    connection.query(QUERY_STRING, [authToken, userId], (err) => {
      connection.destroy();

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = updateAuthToken;