const db = require('mysql');
const EventEmitter = require('events');

class UserAuthorizationDataDao extends EventEmitter {
  constructor() {
    super();

    this.connection = db.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'testPass',
			database : 'test_table',
			port : 3004,
			insecureAuth : true
		});
  }

  storeAutorizationInfo(user, accessToken, refreshToken) {

    const query = `INSERT INTO userAuthorizationInfo
                  (user, accessToken, refreshToken) VALUES
                  (\'${user}\', \'${accessToken}\', \'${refreshToken}\');`;

    this.connection.query(query, (error, results, fields) => {
      if (error) {
        console.log(error);
      } else {
        this.emit('complete');
      }

      connection.destroy();
    });
  }

  retrieveAuthorizationInfo(user, callback) {
    const query = `SELECT * FROM userAuthorizationInfo WHERE user=\'${user}\';`;

    this.connection.query(query, (error, results, fields) => {
        if (error) {
          console.log(error);
        }
        setImmediate(callback, error, results);
    });
  }
}

module.exports.UserAuthorizationDataDao = UserAuthorizationDataDao;
