const userDataRetriever = require('/home/ericoseid/party_playlists/external/spotify/users/GetUserData.js');
const userAuthDao =
  require('/home/ericoseid/party_playlists/persistence/UserAuthorizationDataDao.js');
const refreshAndUpdate = require('/home/ericoseid/party_playlists/tasks/RefreshAndUpdateAuthorizationData.js');

const GetUserInfoTask = {
  handle401Error : function(user, callback) {
    refreshAndUpdate.refreshAndUpdateAuthorizationData(user, (err, res) => {
      if (err) {
        setImmediate(callback, err, undefined);
      } else {
        userAuthDao.retrieveAuthorizationData(user, (err, res) => {
          if (err) {
            setImmediate(callback, err, undefined);
          } else {
            this.retrieveUserData(user, res[0].authorizationToken, false, callback);
          } 
        });
      }
    })
  },

  retrieveUserData : function(user, authorization, retry, callback) {
    userDataRetriever.getUserData(authorization, (err, res) => {
      if (err) {
        setImmediate(callback, err, undefined);
      } else {
        if (res.error) {
          if (res.error.status == 401 && retry) {
            this.handle401Error(user, callback);
          } else {
            setImmediate(callback, res, undefined);
          }
        } else {
          setImmediate(callback, undefined, res);
        }
      }
    });
  },

  getUserInfo : function(user, callback) {
    userAuthDao.retrieveAuthorizationData(user, (err, res) => {
      if (err) {
        setImmediate(callback, err, undefined);
      } else if (!res) {
        setImmediate(callback, 'No authorization data found for user', undefined);
      } else {
        this.retrieveUserData(user, res[0].authorizationToken, true, callback);
      }
    });
  }
};

module.exports = GetUserInfoTask
