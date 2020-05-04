const queryPlaylistDataByPlaylistId = require('../../persistence/playlists/QueryPlaylistData.js');
const userDataQuery = require('../../persistence/userData/queryUserData.js');
const executeSpotifyRequest = require('../../external/spotify/SpotifyApiRequestHelper.js');
const addTrackToPlaylist = require('../../external/spotify/playlists/AddTrackToPlaylist');


const handleAddTrackRequest = async (requestObject) => {
  if (!requestObject.playlistId) {
    return ({statusCode : '400', message : 'Playlist ID is not present in the request'});
  } else if (!requestObject.trackUri) {
    return ({statusCode : '400', message : 'Track URI is not present in the request'});
  }

  const {playlistId, trackUri} = requestObject;

  try {
    const playlistData = await queryPlaylistDataByPlaylistId(playlistId);

    const userData = await userDataQuery.queryByUserName(playlistData.user_id);
    
    const apiRequest = buildAddTrackToPlaylistRequest(playlistId, trackUri, userData.auth_token);

    await executeSpotifyRequest(addTrackToPlaylist, userData.user_id);
  } catch {
    return ({statusCode : '500', message : 'Internal Failure. Please try again after some time.'});
  }
}

const buildAddTrackToPlaylistRequest = (playlistId, trackUri, authToken) {
  return ({
    playlistId : playlistId,
    trackUri : trackUri,
    authToken : authToken,
  });
}

module.exports = handleAddTrackRequest;
