const userAuthDb = require('/home/ericoseid/party_playlists/persistence/UserAuthorizationDataDao.js');
const {refreshAccessCredentials} =
  require('../external/spotify/authorization/AccessCredentialRefresher.js');

function refreshAndUpdateAuthorizationData(user, callback) {
  userAuthDb.retrieveAuthorizationData(user, (err, row) => {
    if (err) {
      setImmediate(callback, err);
    } else {
      refreshAccessCredentials(row[0].refreshToken, (err, res) => {
        if (err) {
          setImmediate(callback, err);
        } else {
          userAuthDb.updateAuthorizationToken(user, res.access_token, (err) => {
            setImmediate(callback, err);
          });
        }
      });
    }
  });
}

module.exports.refreshAndUpdateAuthorizationData =
  refreshAndUpdateAuthorizationData;
