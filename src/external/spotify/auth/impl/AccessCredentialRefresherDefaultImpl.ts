import querystring from "querystring";
import https from "https";

export default class AccessCredentialRefresherDefaultImpl
  implements AccessCredentialRefresher {
  private readonly spotifyClientId: string;
  private readonly spotifyClientSecret: string;

  constructor(spotifyClientId: string, spotifyClientSecret: string) {
    this.spotifyClientId = spotifyClientId;
    this.spotifyClientSecret = spotifyClientSecret;
  }

  refreshAccessCredentials(
    refreshToken: string
  ): Promise<AuthenticationResponse> {
    const postData = this.generatePostData(refreshToken);

    const requestOptions = this.generateRequestOptions(postData);

    return new Promise<AuthenticationResponse>((resolve, reject) => {
      const request = https.request(requestOptions, (res) => {
        res.setEncoding("utf8");

        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          resolve(JSON.parse(rawData));
        });
      });

      request.on("error", (err) => reject(err));

      request.write(postData);
      request.end();
    });
  }
  private generatePostData(refreshToken: string): string {
    return querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
  }

  private generateRequestOptions(postData: string) {
    const appCredentials = `${this.spotifyClientId}:${this.spotifyClientSecret}`;

    return {
      hostname: "accounts.spotify.com",
      path: "/api/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
        Authorization: `Basic ${Buffer.from(appCredentials).toString(
          "base64"
        )}`,
      },
    };
  }
}
