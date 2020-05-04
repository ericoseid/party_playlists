const refreshAndUpdateUserAuthorization  = require('../../tasks/RefreshAndUpdateUserAuthorization.js');

class SpotifyApiRequestHelper {
  constructor(apiCaller) {
    this.apiCaller = apiCaller;

    this.executeRequest = this.executeRequest.bind(this);
  }

  async executeRequest(requestBody, username) {
    let apiResponse = await this.apiCaller.call(requestBody);
    console.log(apiResponse);
    if (apiResponse.error) {
      if (apiResponse.error.status = '401') {
        const authToken = await refreshAndUpdateUserAuthorization(username);

        requestBody.authToken = authToken;

        apiResponse = await this.apiCaller.call(requestBody);
      }
    }

    return apiResponse;
  }
}

module.exports = SpotifyApiRequestHelper;