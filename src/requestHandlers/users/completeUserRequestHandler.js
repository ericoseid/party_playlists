const retrieveAccessCredentialsMod = require('../../external/spotify/auth/AccessCredentialRetriever');
const UserDataRetriever = require('../../external/spotify/users/getUserData');
const {updateUserInfoWithSpotifyInfo} = require('../../persistence/userData/updateUserInfoWithSpotifyInfo');

async function handleCompleteUserRequest(requestBody) {
  if (!requestBody.auth_code || !requestBody.user_name) {
    return '400';
  }
  
  try {
    const authData = await retrieveAccessCredentialsPromise(requestBody.auth_code);
    
    const userData  = await getUserDataPromise(authData.access_token);
    
    updateUserInfoWithSpotifyInfo(requestBody.user_name,
                                  userData.id, 
                                  authData.access_token, 
                                  authData.refresh_token);
  } catch (err) {
    console.log(err);

    return '500';
  }

  return '200';
}

const retrieveAccessCredentialsPromise = (authCode) => {
  return new Promise((resolve, reject) => {
    retrieveAccessCredentialsMod.retrieveAccessCredentials(authCode, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

const getUserDataPromise = (accessToken) => {
  return new Promise((resolve, reject) => {
    UserDataRetriever.getUserData(accessToken, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  })
}

module.exports.handleCompleteUserRequest = handleCompleteUserRequest;
