import https from "https";
import encode from "querystring";

export default class SpotifyApiCallerDefaultImpl implements SpotifyApiCaller {
  private credentialRefresher: AccessCredentialRefresher;

  constructor(credentialRefresher: AccessCredentialRefresher) {
    this.credentialRefresher = credentialRefresher;
  }

  async call(
    requestOptions: any,
    requestBody: any | null
  ): Promise<SpotifyResponse> {
    try {
      const response = await this.executeRequest(requestOptions, requestBody);

      if (response.error) {
        return await this.handleErrorResponse(response);
      }

      return response;
    } catch (err) {
      const error = new Error("Spotify API call failed");
      error.stack = err;

      throw error;
    }
  }

  private executeRequest(
    requestOptions: any,
    requestBody: any | null
  ): Promise<SpotifyResponse> {
    return new Promise<SpotifyResponse>((resolve, reject) => {
      const request = https.request(requestOptions, (res) => {
        res.setEncoding("utf8");

        let rawData: string = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          let jsonData = JSON.parse(rawData);

          resolve({
            error: jsonData.error,
            data: !jsonData.error ? jsonData : null,
          });
        });
      });

      request.on("error", (err) => {
        reject(err);
      });

      if (requestBody) {
        request.write(encode.stringify(requestBody));
      }

      request.end();
    });
  }

  private async handleErrorResponse(
    response: SpotifyResponse
  ): Promise<SpotifyResponse> {
    if (response.error?.status === 401) {
      return response;
    } else {
      return response;
    }

    return response;
  }
}
