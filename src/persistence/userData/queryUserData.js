const sql = require('mysql');

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};


const queryUserData = {
  queryByUserName : function(userName) {
    const connection = sql.createConnection(CONNECTION_INFO);

    const queryString = 'SELECT * FROM user_data WHERE user_name=?;';

    return new Promise((resolve, reject) => {
      connection.query(queryString, [userName], (err, rows) => {
        connection.destroy();

        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
  },

  queryByUserEmail : function(email) {
    const connection = sql.createConnection(CONNECTION_INFO);

    const queryString = 'SELECT * FROM user_data WHERE user_email=?;';

    return new Promise((resolve, reject) => {
      connection.query(queryString, [email], (err, rows) => {
        connection.destroy();

        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }
};

module.exports.queryUserData = queryUserData;