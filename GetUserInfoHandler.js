const {UserAuthorizationDataDao} = require('./UserAuthorizationDataDao.js');
const {UserInfoRetriever} = require('./UserInfoRetriever');

class GetUserInfoHandler {
  handle(user, callback) {
    const userAuthorizationDataDao = new UserAuthorizationDataDao();
    const userInfoRetriever = new UserInfoRetriever();

    userAuthorizationDataDao.retrieveAuthorizationInfo(user, (err, response) => {
      if (err) {
        setImmediate(callback, err, undefined);
      } else {
        if (response) {
          userInfoRetriever.retrieve(response[0].access_token, (err, response) => {
            if (err === '401') {
              setImmediate(callback, undefined, {statusCode : '401'});
            }
          })
        }
      }
    });
  }
}

module.exports.GetUserInfoHandler = GetUserInfoHandler;
