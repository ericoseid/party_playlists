import { SpotifyResponseHandler } from "./SpotifyResponseHandler";

export class SpotifyResponseHandlerImpl implements SpotifyResponseHandler {
  handle(spotifyResponse: SpotifyResponse): object {
    if (spotifyResponse.error) {
      const e = new Error("Spotify call failed");

      e.stack = spotifyResponse.error.message;

      throw e;
    }

    if (!spotifyResponse.data) {
      throw new Error("Spotify response data not present");
    }

    return spotifyResponse.data;
  }
}
