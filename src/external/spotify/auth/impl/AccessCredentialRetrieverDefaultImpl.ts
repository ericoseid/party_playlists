import https from "https";
import querystring from "querystring";

export default class AccessCredentialDefaultRetriever
  implements AccessCredentialRetriever {
  private readonly spotifyClientId: string;
  private readonly spotifyClientSecret: string;

  constructor(spotifyCientId: string, spotifyClientSecret: string) {
    this.spotifyClientId = spotifyCientId;
    this.spotifyClientSecret = spotifyClientSecret;
  }

  async retrieveAccessCredentials(
    authCode: string
  ): Promise<AuthenticationResponse> {
    const postData: string = this.generatePostData(authCode);

    const requestOptions: any = this.generateRequestOptions(postData);

    return new Promise<AuthenticationResponse>((resolve, reject) => {
      const request = https.request(requestOptions, (res) => {
        res.setEncoding("utf8");

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const responseObject: AuthenticationResponse = JSON.parse(data);

          resolve(responseObject);
        });
      });

      request.on("error", (err) => {
        reject(err);
      });

      request.write(postData);
      request.end();
    });
  }

  private generatePostData(authCode: string): string {
    return querystring.stringify({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: "http://127.0.0.1:3000/CompleteAccount",
      client_id: this.spotifyClientId,
      client_secret: this.spotifyClientSecret,
    });
  }

  private generateRequestOptions(postData: string): any {
    return {
      hostname: "accounts.spotify.com",
      path: "/api/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": postData.length,
      },
    };
  }
}
