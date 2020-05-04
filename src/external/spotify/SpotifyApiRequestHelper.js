const refreshAndUpdateUserAuthorization  = require('../../tasks/RefreshAndUpdateUserAuthorization.js');

const executeSpotifyRequest = async (apiCaller, requestBody, username) => {
  let apiResponse
  try {
    apiCaller.call(requestBody);
  } catch {
    throw ('Failure while calling spotify API');
  }

  if (apiResponse.error) {
    if (apiResponse.error.status = '401') {
      const authToken = await refreshAndUpdateUserAuthorization(username);

      requestBody.authToken = authToken;

      apiResponse = await this.apiCaller.call(requestBody);
    } else {
      throw ('Failure while calling spotify API');
    }
  }

  return apiResponse;
}

module.exports = executeSpotifyRequest;