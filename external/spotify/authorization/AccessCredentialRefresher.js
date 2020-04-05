const https = require('https');
const {UserAuthorizationDataDao} = require('../../../UserAuthorizationDataDao');

class AccessCredentialRetriever {
  refreshCredentials(user) {
    const userAuthorizationDataDao new UserAuthorizationDataDao();

    userAuthorizationDataDao.retrieve(user, (err, row) => {
      
    })
  }
}
