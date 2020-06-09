import https from "https";

export default class GetUserDataApiCaller {
  public call(authToken: string): Promise<SpotifyResponse> {
    const requestOptions = this.buildRequestOptions(authToken);

    return new Promise<SpotifyResponse>((resolve, reject) => {
      const request = https.get(requestOptions, (res) => {
        res.setEncoding("utf8");

        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const dataJson = JSON.parse(data);

          resolve({
            error: dataJson.error,
            data: !dataJson.error ? dataJson : null,
          });
        });
      });

      request.on("error", (err) => reject(err));
    });
  }

  private buildRequestOptions(authToken: string) {
    return {
      hostname: "api.spotify.com",
      path: "/v1/me",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }
}
