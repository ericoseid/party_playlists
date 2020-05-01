const retrieveAccessCredentialsMod = require('../../external/spotify/auth/AccessCredentialRetriever');
const UserDataRetriever = require('../../external/spotify/users/getUserData');

async function handleCompleteUserRequest(requestBody) {
  let authData;
  try {
    authData = await retrieveAccessCredentialsPromise(requestBody.auth_code);
  } catch (err) {
    return '500';
  }

  let userData;
  try {
    userData  = await getUserDataPromise(authData.access_token);
  } catch (err) {
    return '500';
  }

  console.log(userData);

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
