import { AddTrackToPlaylistApiCaller } from "../AddTrackToPlaylistApiCaller";
import { resolve } from "path";
import { SpotifyApiCaller } from "../../SpotifyApiCaller";
import { UserData } from "../../../../data/UserData";

export default class AddTrackToPlaylistApiCallerDefaultImpl
  implements AddTrackToPlaylistApiCaller {
  private static readonly API_PATH_PREFIX = "/v1/playlists/";
  private static readonly API_PATH_SUFFIX = "/tracks";

  private readonly apiCaller: SpotifyApiCaller;

  constructor(apiCaller: SpotifyApiCaller) {
    this.apiCaller = apiCaller;
  }

  async addTrackToPlaylist(
    userData: UserData,
    trackId: string,
    playlistId: string
  ): Promise<void> {
    const apiPath = this.buildApiPath(playlistId);

    const requestBody = this.buildRequestBody(trackId);

    const response: SpotifyResponse = await this.apiCaller.call(
      apiPath,
      requestBody,
      userData
    );

    if (response.error) {
      const e = new Error("Spotify Call failed");

      e.stack = response.error.message;

      throw e;
    }
  }

  private buildApiPath(playlistId: string): string {
    return `${AddTrackToPlaylistApiCallerDefaultImpl.API_PATH_PREFIX}${playlistId}${AddTrackToPlaylistApiCallerDefaultImpl.API_PATH_SUFFIX}`;
  }

  private buildRequestBody(trackId: string): string {
    return JSON.stringify([trackId]);
  }
}
