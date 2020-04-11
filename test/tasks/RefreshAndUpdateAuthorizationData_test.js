const assert = require('assert');
const sinon = require('sinon');
const {refreshAndUpdateAuthorizationData} = require('/home/ericoseid/party_playlists/tasks/RefreshAndUpdateAuthorizationData.js');
const userAuthDb = require('/home/ericoseid/party_playlists/persistence/UserAuthorizationDataDao.js');

describe('refreshAndUpdateAuthorizationData', () => {
  const USER = 'user';
  describe('when the query to the Authorization DB fails', () => {
    it('passes the error into the callback', (done) => {
      fake = sinon.fake.yields('error', undefined);
      sinon.replace(userAuthDb, 'retrieveAuthorizationData', fake);
      
      refreshAndUpdateAuthorizationData(USER, (err) => {
        assert.ok(err);

        done();
      });
    });
  });
});
