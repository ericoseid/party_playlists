export interface SpotifyResponseHandler {
  handle: (response: SpotifyResponse) => object;
}
