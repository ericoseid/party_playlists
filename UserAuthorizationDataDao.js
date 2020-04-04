const db = require('mysql');
const EventEmitter = require('events');

class UserAuthorizationDataDao extends EventEmitter {
  storeAutorizationInfo(user, accessToken, refreshToken) {
    const connection = db.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'testPass',
			database : 'test_table',
			port : 3004,
			insecureAuth : true
		});

    const query = `INSERT INTO userAuthorizationInfo
                  (user, accessToken, refreshToken) VALUES
                  (\'${user}\', \'${accessToken}\', \'${refreshToken}\');`;

    connection.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        this.emit('complete');
      }

      connection.destroy();
    });
  }
}

module.exports.UserAuthorizationDataDao = UserAuthorizationDataDao;
