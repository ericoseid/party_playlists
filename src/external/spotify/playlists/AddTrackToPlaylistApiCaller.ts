import { UserData } from "../../../data/UserData";

export interface AddTrackToPlaylistApiCaller {
  addTrackToPlaylist: (
    userId: UserData,
    trackId: string,
    playlistId: string
  ) => Promise<void>;
}
