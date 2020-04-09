const assert = require('assert');
const sinon = require('sinon');

const mysql = require('mysql');
const {retrieveAuthorizationData} =
  require('../persistence/UserAuthorizationDataDao.js');

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

describe('retrieveAuthorizationData', () => {
  const query = "SELECT * FROM userAuthorizationInfo WHERE user=\'eric\';"

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
    it('passes a list containing the resule to the callback', (done) => {
      createConnection.withArgs(dbConnectionInfo).returns(connection);
      connection.query
                .withArgs(query, sinon.match.func)
                .yields(undefined, ['row'], undefined);

      retrieveAuthorizationData('eric', (error, row) => {
        assert.ok(!error);
        assert.strictEqual('row', row[0]);

        done();
      });
    });
  });
});
