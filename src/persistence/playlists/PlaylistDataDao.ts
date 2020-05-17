interface PlaylistDataDao {
  queryByPlaylistId: (playlistId: string) => Promise<PlaylistData>;
}
