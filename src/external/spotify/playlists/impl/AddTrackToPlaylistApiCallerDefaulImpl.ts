import { AddTrackToPlaylistApiCaller } from "../AddTrackToPlaylistApiCaller";
import { resolve } from "path";
import { SpotifyApiCaller } from "../../SpotifyApiCaller";
import { UserData } from "../../../../data/UserData";
import { SpotifyResponseHandler } from "../../SpotifyResponseHandler";

export default class AddTrackToPlaylistApiCallerDefaultImpl
  implements AddTrackToPlaylistApiCaller {
  private static readonly API_PATH_PREFIX = "/v1/playlists/";
  private static readonly API_PATH_SUFFIX = "/tracks";

  private readonly apiCaller: SpotifyApiCaller;
  private readonly responseHandler: SpotifyResponseHandler;

  constructor(
    apiCaller: SpotifyApiCaller,
    responseHandler: SpotifyResponseHandler
  ) {
    this.apiCaller = apiCaller;
    this.responseHandler = responseHandler;
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

    this.responseHandler.handle(response);
  }

  private buildApiPath(playlistId: string): string {
    return `${AddTrackToPlaylistApiCallerDefaultImpl.API_PATH_PREFIX}${playlistId}${AddTrackToPlaylistApiCallerDefaultImpl.API_PATH_SUFFIX}`;
  }

  private buildRequestBody(trackId: string): any {
    return { uris: [`spotify:track:${trackId}`] };
  }
}
