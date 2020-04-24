const assert = require('assert');
const sinon = require('sinon');
const sql = require('mysql');
const {queryUserData} = require('/home/ericoseid/party_playlists/src/persistence/userData/queryUserData.js');


const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 'SELECT * FROM user_data WHERE user_name=?;';

const VALUE_LIST = ['user'];

let connection;

describe('queryUserData', () => {
  beforeEach(() => {
    connection = {
      query : sinon.stub(),
      destroy : sinon.spy()
    };

    createConnection = sinon.stub(sql, 'createConnection');
  });

  describe('queryByUserName', () => {
    describe('when the query succeeds', () => {
      it('returns the row', async () => {
        createConnection.withArgs(CONNECTION_INFO).returns(connection);

        connection.query
                  .withArgs(QUERY_STRING, 
                            sinon.match.array.deepEquals(VALUE_LIST),
                            sinon.match.func)
                  .yields(undefined, ['row']);
        
        const result = await queryUserData.queryByUserName('user');

        assert.equal('row', result[0]);
      });
    });
  });
});