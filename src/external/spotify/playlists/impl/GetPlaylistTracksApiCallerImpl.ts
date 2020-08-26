import { GetPlaylistTracksApiCaller } from "../GetPlaylistTracksApiCaller";
import { UserData } from "../../../../data/UserData";
import { SpotifyApiCaller } from "../../SpotifyApiCaller";
import { SpotifyResponseHandler } from "../../SpotifyResponseHandler";
import { GetUserPlaylistApiCallerDefaulImpl } from "./GetUserPlaylistsApiCallerDefaultImpl";

export default class GetPlaylistTracksApiCallerImpl
  implements GetPlaylistTracksApiCaller {
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

  async getPlaylistTracks(
    userData: UserData,
    playlistId: string
  ): Promise<any> {
    const apiPath = this.buildApiPath(playlistId);

    const response = await this.apiCaller.call(apiPath, null, userData);

    return this.responseHandler.handle(response);
  }

  private buildApiPath(playlistId: string): string {
    return (
      GetPlaylistTracksApiCallerImpl.API_PATH_PREFIX +
      playlistId +
      GetPlaylistTracksApiCallerImpl.API_PATH_SUFFIX
    );
  }
}
