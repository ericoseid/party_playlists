interface PlaylistData {
  playlistId: string;
  userId: string;
  spotifyPlaylistId: string;
  playlistName: string;
  createdDate: Date;
}

function isPlaylistData(object: any): object is PlaylistData {
  return (
    "playlistId" in object &&
    "userId" in object &&
    "spotifyPlaylistId" in object &&
    "createdData" in object
  );
}
