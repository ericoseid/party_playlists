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

let connection;

describe('queryUserData', () => {
  beforeEach(() => {
    connection = {
      query : sinon.stub(),
      destroy : sinon.spy()
    };

    createConnection = sinon.stub(sql, 'createConnection');

    createConnection.withArgs(CONNECTION_INFO).returns(connection);
  });

  afterEach(() => {
    sinon.restore();
  })

  describe('queryByUserName', () => {
    describe('when the query succeeds', () => {
      it('returns the row', async () => {
        const queryString = 'SELECT * FROM user_data WHERE user_name=?;';
        
        const valueList = ['user'];

        connection.query
                  .withArgs(queryString, 
                            sinon.match.array.deepEquals(valueList),
                            sinon.match.func)
                  .yields(undefined, ['row']);
        
        const result = await queryUserData.queryByUserName('user');

        assert.equal('row', result[0]); 
        assert.ok(connection.destroy.calledOnce); 
      }); 
    });
   }); 
   
   describe('queryByUserName', () => { 
     describe('when the query fails', () => { 
       it('rejects with the error', async () => { 
        const queryString = 'SELECT * FROM user_data WHERE user_name=?;'; 

        const valueList = ['user'];

        connection.query.withArgs(queryString, 
                                  sinon.match.array.deepEquals(valueList), 
                                  sinon.match.func).yields('error', undefined); 

        let ok = false; 

        try { 
          await queryUserData.queryByUserName('user'); 
        } catch (err) { 
          assert.equal('error', err); 
          ok = true; } 
        finally { 
          assert.ok(ok); 
        } 
        }); 
      }); 
    }); 

  describe('queryByUserEmail', () => { 
    describe('when the query succeeds', () => { 
      it('returns the row', async () => {
        const queryString = 'SELECT * FROM user_data WHERE user_email=?;';
        
        const valueList = ['email'];

        connection.query.withArgs(queryString,
                                  sinon.match.array.deepEquals(valueList),
                                  sinon.match.func).yields(undefined, ['row']);
        
        const res = await queryUserData.queryByUserEmail('email');

        assert.equal('row', res[0]);
        assert.ok(connection.destroy.calledOnce);
      });
    });
  });

  describe('queryByUserEmail', () => {
    describe('when the query fails', () => {
      it('rejects with the error', async () => {
        const queryString = 'SELECT * FROM user_data WHERE user_email=?;'; 

        const valueList = ['email'];

        connection.query.withArgs(queryString, 
                                  sinon.match.array.deepEquals(valueList), 
                                  sinon.match.func).yields('error', undefined); 

        let ok = false; 

        try { 
          await queryUserData.queryByUserEmail('email'); 
        } catch (err) { 
          assert.equal('error', err); 
          ok = true; } 
        finally { 
          assert.ok(ok); 
        } 
      });
    });
  });
});                     