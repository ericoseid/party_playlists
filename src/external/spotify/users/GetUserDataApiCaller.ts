import https from "https";
import { SpotifyApiCaller } from "../SpotifyApiCaller";
import { UserData } from "../../../data/UserData";

export default class GetUserDataApiCaller {
  private static readonly API_PATH = "/v1/me";

  private readonly apiCaller: SpotifyApiCaller;

  constructor(apiCaller: SpotifyApiCaller) {
    this.apiCaller = apiCaller;
  }

  async call(userData: UserData): Promise<any> {
    const response = await this.apiCaller.call(
      GetUserDataApiCaller.API_PATH,
      null,
      userData
    );

    if (response.error) {
      const e = new Error("Spotify call failed");

      e.stack = e.message;

      throw e;
    }

    return response.data;
  }
}
