import https from "https";

export default class GetUserPlaylistsApiCaller {
  call(authToken: string, userId: string): Promise<SpotifyResponse> {
    const requestOptions = this.buildRequestOptions(authToken, userId);

    return new Promise<SpotifyResponse>((resolve, reject) => {
      const request = https.get(requestOptions, (res) => {
        res.setEncoding("utf8");

        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });

        res.on("end", () => {
          const dataJson = JSON.parse(rawData);

          resolve({
            error: dataJson.error,
            data: !dataJson.error ? dataJson : null,
          });
        });
      });

      request.on("error", (err) => {
        reject(err);
      });
    });
  }

  private buildRequestOptions(authToken: string, userId: string): any {
    return {
      hostname: "api.spotify.com",
      path: `/v1/users/${userId}/playlists`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  }
}
