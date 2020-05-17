import assert from "assert";
import sinon from "sinon";

import PlaylistDataDaoDefaultImpl from "../../../../src/persistence/playlists/impl/PlaylistDataDaoDefaultImpl";
import { Connection } from "mysql";

describe("PlaylistDataDaoDefaultImpl", () => {
  let PLAYLIST_ID = "playlistId";
  let QUERY_STRING = `SELECT * FROM user_data WHERE playlistId="${PLAYLIST_ID}";`;
  let ERROR = { errno: 123 };
  let ROW: PlaylistData = {
    playlistId: "playlistId",
    userId: "userId",
    spotifyPlaylistId: "spotifyPlaylistId",
    playlistName: "playlistName",
    createdDate: new Date(0),
  };
  let dbConnection: any;
  let daoImpl: PlaylistDataDao;

  beforeEach(() => {
    dbConnection = <Connection>(<unknown>{
      query: sinon.stub(),
    });
    daoImpl = new PlaylistDataDaoDefaultImpl(dbConnection);
  });

  describe("queryByPlaylistId", () => {
    it("rejects with an error code when the query fails", async () => {
      dbConnection.query
        .withArgs(QUERY_STRING, sinon.match.func)
        .yields(ERROR, null);

      let ok = false;
      try {
        await daoImpl.queryByPlaylistId(PLAYLIST_ID);
      } catch (err) {
        ok = err === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("resolves with a PlaylistData object if the query is successful", async () => {
      dbConnection.query
        .withArgs(QUERY_STRING, sinon.match.func)
        .yields(null, [ROW]);

      assert.equal(ROW, await daoImpl.queryByPlaylistId(PLAYLIST_ID));
    });
  });
});
