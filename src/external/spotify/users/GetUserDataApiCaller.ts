import https from "https";
import { SpotifyApiCaller } from "../SpotifyApiCaller";
import { UserData } from "../../../data/UserData";

export default class GetUserDataApiCaller {
  private static readonly API_PATH = "/v1/me";

  private readonly apiCaller: SpotifyApiCaller;

  constructor(apiCaller: SpotifyApiCaller) {
    this.apiCaller = apiCaller;
  }

  async call(userData: UserData): Promise<string> {
    const response = await this.apiCaller.call(
      GetUserDataApiCaller.API_PATH,
      null,
      userData
    );

    return new Promise<string>((resolve, reject) => resolve());
  }
}
