const sql = require('mysql');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 'SELECT * FROM user_data WHERE user_name=?;';

const queryUserData = {
  queryByUserName : function(userName) {
    const connection = sql.createConnection(CONNECTION_INFO);

    return new Promise((resolve, reject) => {
      connection.query(QUERY_STRING, [userName], (err, rows) => {
        if (err) {

        } else {
          resolve(rows);
        }
      })
    });
  }
};

module.exports.queryUserData = queryUserData;