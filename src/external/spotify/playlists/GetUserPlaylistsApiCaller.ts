import { UserData } from "../../../data/UserData";

export interface GetUserPlaylistsApiCaller {
  getUserPlaylists: (userData: UserData) => Promise<object>;
}
