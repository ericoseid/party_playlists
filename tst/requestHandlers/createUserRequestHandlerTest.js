const assert = require('assert');
const sinon = require('sinon');

const createUserModule = require('/home/ericoseid/party_playlists/src/persistence/userData/createUser.js');
const {queryUserData} = require('../../src/persistence/userData/queryUserData');
const handler = require('/home/ericoseid/party_playlists/src/requestHandlers/createUserRequestHandler.js');

const TEST_REQUEST = {user_name : 'test_field', user_email : 'email'};

describe('handleCreateUserRequest', () =>{

  let createUser;
  let queryByUserName;
  let queryByUserEmail;

  beforeEach(() => {
    createUser = sinon.stub(createUserModule, 'createUser');
    queryByUserName = sinon.stub(queryUserData, 'queryByUserName');
    queryByUserEmail = sinon.stub(queryUserData, 'queryByUserEmail');
  });

  afterEach(() => {
    sinon.restore();
  });
  
  describe('when the request is falsey', () => {
    it('returns a 400', async () => {
      let res = await handler.handleCreateUserRequest(null);

      assert.equal(400, res);
    });
  });

  describe('when the user name is not present', () => {
    it('throws an error', async () => {
      let res = await handler.handleCreateUserRequest({});

      assert.equal(400, res);
    });
  });

  describe('when the user email is not present', () => {
    it('returns a 400', async () => {
      let res = await handler.handleCreateUserRequest({user_name : 'name'});

      assert.equal(400, res);
    });
  });

  describe('when createUser throws an unknown error', () => {
    it('returns a 500 error code', async () => {
      createUser.withArgs(TEST_REQUEST)
                .throws(new Error());

      let res = await handler.handleCreateUserRequest(TEST_REQUEST);

      assert.equal(500, res);
    });
  });

  describe('when createUser throws a 1062', () => {
    describe('and the user name query fails', () => {
      it('returns a 500 error code', async () => {
        createUser.withArgs(TEST_REQUEST)
                  .throws(1062);
        
        queryByUserName.withArgs('test_field')
                       .throws(new Error());
        
        let res = await handler.handleCreateUserRequest(TEST_REQUEST);

        assert.equal(500, res);
      });
    });
  });

  describe('when createUser throws a 1062', () => {
    describe('and the user email query fails', () => {
      it('returns a 500 error code', async () => {
        createUser.withArgs(TEST_REQUEST)
                  .throws(1062);
        
        queryByUserName.withArgs('test_field')
                       .returns([]);
        
        queryByUserEmail.withArgs('email')
                        .throws(new Error());
        
        let res = await handler.handleCreateUserRequest(TEST_REQUEST);

        assert.equal(500, res);
      });
    });
  });

  describe('when createUser throws a 1062', () => {
    describe('and the user name exists in the db', () => {
      it('returns a 405 error code', async () => {
        createUser.withArgs(TEST_REQUEST)
                  .throws(1062);
        
        queryByUserName.withArgs('test_field')
                       .returns(['test_data']);
        
        let res = await handler.handleCreateUserRequest(TEST_REQUEST);

        assert.equal(405, res);
      });
    });
  });

  describe('when the createUser throws a 1062', () => {
    describe('and the user email exists in the db', () => {
      it('returns a 406 error code', async () => {
        createUser.withArgs(TEST_REQUEST)
                  .throws(1062);
        
        queryByUserName.withArgs('test_field')
                       .returns([]);
        
        queryByUserEmail.withArgs('email')
                        .returns(['test_data']);
        
        let res = await handler.handleCreateUserRequest(TEST_REQUEST);

        assert.equal(406, res);
      });
    });
  });

  describe('when createUser throws a 1062', () => {
    describe('and neither username or email exists in the db', () => {
      it('returns a 500 error code', async () => {
        createUser.withArgs(TEST_REQUEST)
                  .throws(1062);
        
        queryByUserName.withArgs('test_field')
                       .returns([]);
        
        queryByUserEmail.withArgs('email')
                        .returns([]);
        
        let res = await handler.handleCreateUserRequest(TEST_REQUEST);

        assert.equal(500, res);
      })
    })
  })

  describe('When createUser succeeds', () => {
    it('returns 200 status code', async () => {

      createUser.withArgs(TEST_REQUEST)
                .returns();

      const res = await handler.handleCreateUserRequest(TEST_REQUEST);

      assert.equal(200, res);
    })
  })
});
