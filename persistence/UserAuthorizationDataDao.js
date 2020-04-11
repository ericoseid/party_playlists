const db = require('mysql');

const UserAuthorizationDataDao = {
  dbConnectionInfo : {
    host : 'localhost',
    user : 'ericoseid',
    password : 'TestPass',
    database : 'party_playlists_db',
    port : 3306,
    insecureAuth : true
  },

  storeAuthorizationData : function(user, accessToken, refreshToken, callback) {
    const connection = db.createConnection(this.dbConnectionInfo);

    const query = `INSERT INTO userAuthorizationInfo
                (user, authorizationToken, refreshToken) VALUES
                (\'${user}\', \'${accessToken}\', \'${refreshToken}\');`;
    
    connection.query(query, (error, results, fields) => {
      setImmediate(callback, error);

      connection.destroy();
    });
  },

  retrieveAuthorizationData : function(user, callback) {
    const connection = db.createConnection(this.dbConnectionInfo);

    const query = `SELECT * FROM userAuthorizationInfo WHERE user=\'${user}\';`;

    connection.query(query, (error, results, fields) => {
        setImmediate(callback, error, results);

        connection.destroy();
    });
  },

  updateAuthorizationToken : function(user, authorizationToken, callback) {
    const connection = db.createConnection(this.dbConnectionInfo);

    const query = `UPDATE userAuthorizationInfo SET
                authorizationToken='${authorizationToken}'
                WHERE user='${user}';`;

    connection.query(query, (error, results, fields) => {
      setImmediate(callback, error);

      connection.destroy();
    })
  }
};

module.exports = UserAuthorizationDataDao;
