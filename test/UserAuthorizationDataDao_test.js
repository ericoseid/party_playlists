const assert = require('assert');
const sinon = require('sinon');
const mysql = require('mysql');
const {storeAuthorizationData,
       retrieveAuthorizationData,
       updateAuthorizationToken} =
  require('../persistence/UserAuthorizationDataDao.js');

const USER = 'eric';
const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const dbConnectionInfo = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};
let connection;
let createConnection;

beforeEach(() => {
  connection = {
    query : sinon.stub(),
    destroy : sinon.stub()
  };

  createConnection = sinon.stub(mysql, 'createConnection');
});

afterEach(() => {
  assert.ok(connection.destroy.calledOnce);

  mysql.createConnection.restore();
});

describe('storeAuthorizationData', () => {
  const query = `INSERT INTO userAuthorizationInfo
                (user, authorizationToken, refreshToken) VALUES
                (\'${USER}\', \'${ACCESS_TOKEN}\', \'${REFRESH_TOKEN}\');`

  describe('when the query fails', () => {
    it('passes an error to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields('error', undefined, undefined);

      storeAuthorizationData(USER, ACCESS_TOKEN, REFRESH_TOKEN,
                             (error) => {
        assert.ok(error);

        done();
      });
    });
  })

  describe('when the query succeeds', () => {
    it('passes a list containing the result to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields(undefined, ['row'], undefined);

      storeAuthorizationData(USER, ACCESS_TOKEN, REFRESH_TOKEN,
                             (error) => {
        assert.ok(!error);

        done();
      });
    });
  });
});

describe('retrieveAuthorizationData', () => {
  const query = `SELECT * FROM userAuthorizationInfo WHERE user=\'${USER}\';`

  describe('when the query fails', () => {
    it('passes an error to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields('error', undefined, undefined);

      retrieveAuthorizationData('eric', (error, row) => {
        assert.ok(error);
        assert.ok(!row);

        done();
      });
    });
  });

  describe('when the query succeeds', () => {
    it('passes a list containing the result to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields(undefined, ['row'], undefined);

      retrieveAuthorizationData(USER, (error, row) => {
        assert.ok(!error);
        assert.strictEqual('row', row[0]);

        done();
      });
    });
  });
});

describe('updateAuthorizationToken', () => {
  const query = `UPDATE userAuthorizationInfo SET
                authorizationToken='${ACCESS_TOKEN}'
                WHERE user='${USER}';`;

  describe('when the query fails', () => {
    it('passes an error to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields('error', undefined, undefined);

      updateAuthorizationToken(USER, ACCESS_TOKEN, (error) => {
        assert.ok(error);

        done();
      });
    });
  })

  describe('when the query succeeds', () => {
    it('passes a list containing the result to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields(undefined, ['row'], undefined);

      updateAuthorizationToken(USER, ACCESS_TOKEN, (error) => {
        assert.ok(!error);

        done();
      });
    });
  });
});
