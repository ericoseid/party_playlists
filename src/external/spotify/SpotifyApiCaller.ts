import { UserData } from "../../data/UserData";

export interface SpotifyApiCaller {
  call: (
    requestOptions: any,
    requestBody: any | null,
    userData: UserData
  ) => Promise<SpotifyResponse>;
}
