const {retrieveAuthorizationData} =
  require('../persistence/UserAuthorizationDataDao.js');
const {updateAuthorizationToken} =
  require('../persistence/UserAuthorizationDataDao.js');
const {refreshAccessCredentials} =
  require('../external/spotify/authorization/AccessCredentialRefresher.js');

function refreshAndUpdateAuthorizationData(user, callback) {
  retrieveAuthorizationData(user, (err, row) => {
    if (err) {
      setImmediate(callback, err);
    } else {
      refreshAccessCredentials(row[0].refreshToken, (err, res) => {
        if (err) {
          setImmediate(callback, err);
        } else {
          updateAuthorizationToken(user, res.access_token, (err) => {
            setImmediate(callback, err);
          });
        }
      });
    }
  });
}

module.exports.refreshAndUpdateAuthorizationData =
  refreshAndUpdateAuthorizationData;
