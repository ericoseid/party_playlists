const {retrieveAccessCredentials} =
  require('../external/spotify/authorization/AccessCredentialRetriever.js');
const {storeAuthorizationData} =
  require('../persistence/UserAuthorizationDataDao.js');

function retrieveAndStoreAuthorizationData(user, authCode, callback) {
  retrieveAccessCredentials(authCode, (err, authData) => {
      storeAuthorizationData(user,
                             authData.access_token,
                             authData.refresh_token,
                             (err) => {
        setImmediate(callback, err);
      });
    }
  );
}

module.exports.retrieveAndStoreAuthorizationData = retrieveAndStoreAuthorizationData;
