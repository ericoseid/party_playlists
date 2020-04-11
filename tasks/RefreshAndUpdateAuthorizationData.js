const userAuthDb = require('/home/ericoseid/party_playlists/persistence/UserAuthorizationDataDao.js');
const refresher =
  require('../external/spotify/authorization/AccessCredentialRefresher.js');

const RefreshAndUpdateAuthorizationData = {
  refreshAndUpdateAuthorizationData : function(user, callback) {
    userAuthDb.retrieveAuthorizationData(user, (err, row) => {
      if (err) {
        setImmediate(callback, err);
      } else {
        refresher.refreshAccessCredentials(row[0].refreshToken, (err, res) => {
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
}

module.exports = RefreshAndUpdateAuthorizationData;
