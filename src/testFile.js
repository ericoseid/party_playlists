const SpotifyApiRequestHelper = require('./external/spotify/SpotifyApiRequestHelper.js');
const AddTrackToPlaylist = require('./external/spotify/playlists/AddTrackToPlaylist.js');


const requestHelper = new SpotifyApiRequestHelper(AddTrackToPlaylist);

requestHelper.executeRequest({
  playlistId : '2RtFhJ1XdLkEoRubL5vceC',
  trackUri : 'spotify:track:1bvLM7nHc05xXIhWiyjssj',
  authToken : 'BQCksI3rgMbBNwzMdOjXgePSht-AHgdQOSm_P7MDUrr66iXdeuhiBmAbHfMZ09mCt40AVTUOMauyGZnTLnnKB9AULcoP8icbOlStbmoX45zAeTYSDD_AwJ-Vr_ZBJLZ9beJ8kvgWXnzwEmz1'}, 'eric')
  .then(data => console.log(data));