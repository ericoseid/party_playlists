const db = require('mysql');
const EventEmitter = require('events');

class UsersDao extends EventEmitter {
	getUserInfo(user) {
		const connection = db.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'testPass',
			database : 'test_table',
			port : 3004,
			insecureAuth : true
		});

		const query = `SELECT * FROM users WHERE user=\'${user}\'`;

		connection.query(query, (error, results, fields) => {
			if (error) {
				console.log(error);
			} else {
				this.emit('row', results[0]);
			}

			connection.destroy();
		});
	}
}

module.exports.UsersDao = UsersDao;
