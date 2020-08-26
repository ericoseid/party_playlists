import https from "https";
import encode from "querystring";
import { UserData } from "../../data/UserData";
import { SpotifyApiCaller } from "./SpotifyApiCaller";
import { RefreshAndStoreCredentialsDelegate } from "../../tasks/RefreshAndStoreCredentialsDelegate";

export default class SpotifyApiCallerDefaultImpl implements SpotifyApiCaller {
  private refreshAndStoreDelegate: RefreshAndStoreCredentialsDelegate;

  constructor(refreshAndStoreDelegate: RefreshAndStoreCredentialsDelegate) {
    this.refreshAndStoreDelegate = refreshAndStoreDelegate;
  }

  async call(
    apiPath: string,
    requestBody: any | null,
    userData: UserData
  ): Promise<SpotifyResponse> {
    try {
      let response = await this.executeRequest(apiPath, requestBody, userData);

      if (response.error) {
        if (response.error.status !== 401) {
          throw new Error(response.error.message);
        }

        const updatedUserData = await this.getUpdatedAuthentication(userData);

        response = await this.executeRequest(
          apiPath,
          requestBody,
          updatedUserData
        );
      }

      return response;
    } catch (err) {
      const error = new Error("Spotify API call failed");
      error.stack = err;

      throw error;
    }
  }

  private executeRequest(
    apiPath: string,
    requestBody: any | null,
    userData: UserData
  ): Promise<SpotifyResponse> {
    return new Promise<SpotifyResponse>((resolve, reject) => {
      if (!userData.authToken) {
        throw new Error("User does not have authentication credentials");
      }

      const requestOptions = this.generateRequestOptions(
        apiPath,
        userData.authToken
      );

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

  private generateRequestOptions(apiPath: string, authToken: string): any {
    return {
      hostname: "api.spotify.com",
      path: apiPath,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    };
  }

  private async getUpdatedAuthentication(
    userData: UserData
  ): Promise<UserData> {
    if (!userData.refreshToken) {
      throw new Error("user does not have a spotify refresh token");
    }

    const refreshedToken = await this.refreshAndStoreDelegate.refreshAndStoreCredentials(
      userData
    );

    userData.authToken = refreshedToken;

    return userData;
  }
}
