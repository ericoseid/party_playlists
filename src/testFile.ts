import UserDataDaoDefaultImpl from "./persistence/userData/impl/UserDataDaoDefaultImpl";
import mysql from "mysql";
import SpotifyApiCallerDefaultImpl from "./external/spotify/SpotifyApiCallerDefaultImpl";
import SpotifyDependencies from "./injection/external/SpotifyDependencies";
import AppConfig from "./config/AppConfig";
import DatabaseDependencies from "./injection/common/DatabaseDependencies";

AppConfig.initializeFromCustomString(`{
  "spotify" : {
    "clientId" : "90bb1e9b33d9402b887b698376c36715",
    "clientSecret" : "7cab6eb568bc4a41afb28f8d3d3a0670"
  },
  "database" : {
    "partyPlaylistDbConnectionInfo" : {
        "host" : "localhost",
        "user" : "ericoseid",
        "password" : "TestPass",
        "database" : "party_playlists_db",
        "port" : 3306,
        "insecureAuth" : true
    }
  }
}`);

const userDataDao = DatabaseDependencies.getUserDataDao();

userDataDao.queryByUsername("y").then((userData) => {
  const addTrack = SpotifyDependencies.getAddTrackToPlaylistApiCaller();

  addTrack
    .addTrackToPlaylist(
      userData,
      "07oOLyPbBnkAhoAuUovm0d",
      "4VD8h5PNOtqnc1V9vb55oV"
    )
    .then((data) => {
      console.log("what");
      console.log(data);
    })
    .catch((e) => {
      console.log("error:");
      console.log(e);
    });
});
