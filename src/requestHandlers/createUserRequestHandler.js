const createUserModule = require('/home/ericoseid/party_playlists/src/persistence/userData/createUser.js');

async function handleCreateUserRequest(requestBody) {
  if (!requestBody) {
    throw new Error('request body not present');
  } else if (!requestBody.user_name) {
    throw new Error('username not present in request')
  }

  try {
    createUserModule.createUser(requestBody);
  } catch (e) {
    throw e;
  }
}

module.exports.handleCreateUserRequest = handleCreateUserRequest;