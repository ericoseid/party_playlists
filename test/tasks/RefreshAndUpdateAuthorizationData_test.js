const assert = require('assert');
const sinon = require('sinon');
const refreshAndUpdateTask = require('/home/ericoseid/party_playlists/tasks/RefreshAndUpdateAuthorizationData.js');
const userAuthDb = require('/home/ericoseid/party_playlists/persistence/UserAuthorizationDataDao.js');
const refresher =
  require('/home/ericoseid/party_playlists/external/spotify/authorization/AccessCredentialRefresher.js');

describe('refreshAndUpdateAuthorizationData', () => {
  const USER = 'user';
  
  afterEach(() => {
    sinon.restore();
  });

  describe('when the query to the Authorization DB fails', () => {
    it('passes the error into the callback', (done) => {
      const fakeAuthQuery = sinon.fake.yields('error', undefined);
      sinon.replace(userAuthDb, 'retrieveAuthorizationData', fakeAuthQuery);
      
      refreshAndUpdateTask.refreshAndUpdateAuthorizationData(USER, (err) => {
        assert.ok(err);

        done();
      });
    });
  });

  describe('when the refresher fails', () => {
    it('passes the error into the callback', (done) => {
      const fakeAuthQuery = sinon.fake.yields(undefined, [{refreshToken : 'refreshToken'}]);
      sinon.replace(userAuthDb, 'retrieveAuthorizationData', fakeAuthQuery);

      const fakeRefreshCall = sinon.fake.yields('error', undefined);
      sinon.replace(refresher, 'refreshAccessCredentials', fakeRefreshCall);

      refreshAndUpdateTask.refreshAndUpdateAuthorizationData(USER, (err) => {
        assert.ok(err);

        done();
      });
    });
  });

  describe('when the credential storage fails', () => {
    it('passes the error into the callback', (done) => {
      const fakeAuthQuery = sinon.fake.yields(undefined, [{refreshToken : 'refreshToken'}]);
      sinon.replace(userAuthDb, 'retrieveAuthorizationData', fakeAuthQuery);

      const fakeRefreshCall = sinon.fake.yields(undefined, {access_token : 'accessToken'});
      sinon.replace(refresher, 'refreshAccessCredentials', fakeRefreshCall);

      const fakeAuthUpdate = sinon.fake.yields('error');
      sinon.replace(userAuthDb, "updateAuthorizationToken", fakeAuthUpdate);

      refreshAndUpdateTask.refreshAndUpdateAuthorizationData(USER, (err) => {
        assert.ok(err);

        done();
      });
    });
  });

  describe('when everything succeeds', () => {
    it('passes undefined into the callback', (done) => {
      const fakeAuthQuery = sinon.fake.yields(undefined, [{refreshToken : 'refreshToken'}]);
      sinon.replace(userAuthDb, 'retrieveAuthorizationData', fakeAuthQuery);

      const fakeRefreshCall = sinon.fake.yields(undefined, {access_token : 'accessToken'});
      sinon.replace(refresher, 'refreshAccessCredentials', fakeRefreshCall);

      const fakeAuthUpdate = sinon.fake.yields(undefined);
      sinon.replace(userAuthDb, "updateAuthorizationToken", fakeAuthUpdate);

      refreshAndUpdateTask.refreshAndUpdateAuthorizationData(USER, (err) => {
        assert.ok(!err);

        done();
      });
    });
  });
});
