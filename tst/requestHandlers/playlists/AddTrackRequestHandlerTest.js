const proxyquire = require('proxyquire');
const assert = require('assert');
const sinon = require('sinon');

const PLAYLIST_ID = 'playlistId';
const USER_ID = 'userId';
const TRACK_URI = 'trackUri';
const INVALID_INPUT_STATUS_CODE = '400';
const INTERNAL_ERROR_STATUS_CODE = '500';
const ERROR = 'error';

describe('handleAddTrackRequest', () => {
  const playlistDataQuery = sinon.stub();
  const userDataQuery = {
    queryByUserName : sinon.stub()
  }
  
  const handleMethod = proxyquire('./../../../src/requestHandlers/playlists/AddTrackRequestHandler.js', {
    '../../../src/persistence/playlists/QueryPlaylistData.js' : playlistDataQuery,
    '../../../src/persistence/userData/queryUserData.js' : userDataQuery
  });

  describe('when the playlist ID is null in the request', () => {
    it('returns a 400 status code', async () => {
      const response = await handleMethod({});

      assert.equal(INVALID_INPUT_STATUS_CODE, response.statusCode);
      assert.equal('Playlist ID is not present in the request', response.message);
    });
  });

  describe('when the track ID is null in the request', () => {
    it('returns a 400 status code', async () => {
      const response = await handleMethod({playlistId : PLAYLIST_ID});

      assert.equal(INVALID_INPUT_STATUS_CODE, response.statusCode);
      assert.equal('Track URI is not present in the request', response.message);
    });
  });

  describe('when the playlist data query fails', () => {
    it('Returns a 500 status code', async () => {
      playlistDataQuery.withArgs(PLAYLIST_ID).throws(ERROR);

      const response = await handleMethod({playlistId : PLAYLIST_ID, trackUri : TRACK_URI});

      assert.equal(INTERNAL_ERROR_STATUS_CODE, response.statusCode);
    });
  });

  describe('when the user data query fails', () => {
    it('Returns a 500 status code', async () => {
      playlistDataQuery.withArgs(PLAYLIST_ID).returns({user_id : USER_ID});

      userDataQuery.queryByUserName.withArgs(USER_ID).throws(ERROR);

      const response = await handleMethod({playlistId : PLAYLIST_ID, trackUri : TRACK_URI});

      assert.equal(INTERNAL_ERROR_STATUS_CODE, response.statusCode);
    });
  });
});