const queryUserData = require('../persistence/userData/queryUserData.js');
const updateAuthToken = require('../persistence/userData/updateAuthToken.js');
const credentialRefresherModule = require('../external/spotify/auth/AccessCredentialRefresher.js');

const refreshAndUpdateUserAuthorization = async (username) => {
  const userData = await queryUserData.queryByUserName(username);

  const refreshToken = userData.refresh_token;

  const refreshedCredentials 
    = await credentialRefresherModule.refreshAccessCredentials(refreshToken);
  console.log(refreshedCredentials);
  await updateAuthToken(username, refreshedCredentials.access_token); 

  return refreshedCredentials.access_token;
}

module.exports =  refreshAndUpdateUserAuthorization; 
