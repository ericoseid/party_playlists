const assert = require('assert');
const sinon = require('sinon');

const createUserModule = require('/home/ericoseid/party_playlists/src/persistence/userData/createUser.js');
const handler = require('/home/ericoseid/party_playlists/src/requestHandlers/createUserRequestHandler.js');

describe('handleCreateUserRequest', () =>{

  afterEach(() => {
    sinon.restore();
  });
  
  describe('when the request is falsey', () => {
    it('throws an error', async () => {
      let ok = false;

      try {
        await handler.handleCreateUserRequest(undefined);
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });
  });

  describe('when the user name is not present', () => {
    it('throws an error', async () => {
      let ok = false;

      try {
        await handler.handleCreateUserRequest({test_field : 'test_field'});
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });
  });

  describe('when createUser throws an error', () => {
    it('throws an error', async () => {
      const createUser = sinon.stub(createUserModule, 'createUser');

      createUser.throws(new Error());

      let ok = false;

      try {
        await handler.handleCreateUserRequest({user_name : 'test_field'});
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });
  });

  describe('When createUser succeeds', () => {
    it('returns normally', async () => {
      const createUser = sinon.stub(createUserModule, 'createUser');

      createUser.returns();

      await handler.handleCreateUserRequest({user_name : 'test_field'});
    })
  })
});
