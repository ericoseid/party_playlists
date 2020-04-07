const db = require('mysql');

const dbConnectionInfo = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

function storeAuthorizationData(user, accessToken, refreshToken, callback) {
  const connection = db.createConnection(dbConnectionInfo);

  const query = `INSERT INTO userAuthorizationInfo
                (user, authorizationToken, refreshToken) VALUES
                (\'${user}\', \'${accessToken}\', \'${refreshToken}\');`;

  connection.query(query, (error, results, fields) => {
    setImmediate(callback, error);

    connection.destroy();
  });
}

function retrieveAuthorizationData(user, callback) {
  const connection = db.createConnection(dbConnectionInfo);

  const query = `SELECT * FROM userAuthorizationInfo WHERE user=\'${user}\';`;

  connection.query(query, (error, results, fields) => {
      setImmediate(callback, error, results);

      connection.destroy();
  });
}

function updateAuthorizationToken(user, authorizationToken, callback) {
  const connection = db.createConnection(dbConnectionInfo);

  const query = `UPDATE userAuthorizationInfo SET
                authorizationToken='${authorizationToken}'
                WHERE user='${user}';`;

  connection.query(query, (error, results, fields) => {
    setImmediate(callback, error);

    connection.destroy();
  })
}

module.exports.storeAuthorizationData = storeAuthorizationData;
module.exports.retrieveAuthorizationData = retrieveAuthorizationData;
module.exports.updateAuthorizationToken = updateAuthorizationToken;
