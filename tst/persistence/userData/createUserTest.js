const assert = require('assert');
const sinon = require('sinon');
const db = require('mysql')
const createUser = require('/home/ericoseid/party_playlists/src/persistence/userData/createUser.js').createUser;

const CONNECTION_INFO = {
  host : 'localhost',
  user : 'ericoseid',
  password : 'TestPass',
  database : 'party_playlists_db',
  port : 3306,
  insecureAuth : true
};

const QUERY_STRING = 
  `INSERT INTO user_data (user_name, user_email, spotify_id, 
  user_password, auth_token, refresh_token, creation_date) 
  VALUES (?, ?, ?, ?, ?, ?, ?);`;

describe('createUser', () => {
  let connection;
  let createConnection;
  
  beforeEach(() => {
    connection = {
      query : sinon.stub(),
      destroy : sinon.stub()
    };
  
    createConnection = sinon.stub(db, 'createConnection');

    createConnection.withArgs(CONNECTION_INFO).returns(connection);
  })

  describe('when the query fails', () => {
    it('throws an error', async () => {
      const valueList = ['test_val', undefined, undefined, undefined,
                         undefined, undefined, undefined];

      connection.query
                .withArgs(QUERY_STRING, 
                          sinon.match.array.deepEquals(valueList),
                          sinon.match.func)
                .yields('error', undefined, undefined);

      let ok;

      try {
        await createUser({user_name : 'test_val'});

        ok = false;
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });
  });

});