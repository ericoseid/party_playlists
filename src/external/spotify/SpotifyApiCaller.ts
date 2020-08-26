import { UserData } from "../../data/UserData";

export interface SpotifyApiCaller {
  call: (
    apiPath: any,
    requestBody: any | null,
    userData: UserData
  ) => Promise<SpotifyResponse>;
}
