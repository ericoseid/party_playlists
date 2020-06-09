interface SpotifyApiCaller {
  call: (
    requestOptions: any,
    requestBody: any | null
  ) => Promise<SpotifyResponse>;
}
