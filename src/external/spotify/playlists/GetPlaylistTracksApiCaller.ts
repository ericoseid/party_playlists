import { UserData } from "../../../data/UserData";

export interface GetPlaylistTracksApiCaller {
  getPlaylistTracks: (userData: UserData, playlistId: string) => Promise<any>;
}
