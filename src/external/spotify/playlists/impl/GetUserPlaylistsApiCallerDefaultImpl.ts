import { GetUserPlaylistsApiCaller } from "../GetUserPlaylistsApiCaller";
import { UserData } from "../../../../data/UserData";
import { SpotifyApiCaller } from "../../SpotifyApiCaller";
import { SpotifyResponseHandler } from "../../SpotifyResponseHandler";

export class GetUserPlaylistApiCallerDefaulImpl
  implements GetUserPlaylistsApiCaller {
  private static readonly API_PATH_PREFIX = "/v1/users/";
  private static readonly API_PATH_SUFFIX = "/playlists";

  private readonly apiCaller: SpotifyApiCaller;
  private readonly spotifyResponseHandler: SpotifyResponseHandler;

  constructor(
    apiCaller: SpotifyApiCaller,
    spotifyResponseHandler: SpotifyResponseHandler
  ) {
    this.apiCaller = apiCaller;
    this.spotifyResponseHandler = spotifyResponseHandler;
  }

  async getUserPlaylists(userData: UserData): Promise<object> {
    if (!userData.spotifyId) {
      throw new Error("User does not have a Spotify ID");
    }

    const apiPath = this.buildApiPath(userData.spotifyId);

    const response = await this.apiCaller.call(apiPath, null, userData);

    return this.spotifyResponseHandler.handle(response);
  }

  private buildApiPath(userId: string): string {
    return `${GetUserPlaylistApiCallerDefaulImpl.API_PATH_PREFIX}${userId}${GetUserPlaylistApiCallerDefaulImpl.API_PATH_SUFFIX}`;
  }
}
