import mysql from "mysql";
import AppConfig from "../../config/AppConfig";
import UserDataDaoDefaultImpl from "../../persistence/userData/impl/UserDataDaoDefaultImpl";
import PlaylistDataDaoDefaultImpl from "../../persistence/playlists/impl/PlaylistDataDaoDefaultImpl";
import { UserDataDao } from "../../persistence/userData/UserDataDao";

class DatabaseDependencies {
  private static partyPlaylistDbConnection: mysql.Connection;
  private static userDataDao: UserDataDao;
  private static playlistDataDao: PlaylistDataDao;

  public static getPartyPlaylistDbConnection(): mysql.Connection {
    if (!this.partyPlaylistDbConnection) {
      this.partyPlaylistDbConnection = mysql.createConnection(
        AppConfig.getConfig().database.partyPlaylistDbConnectionInfo
      );
    }

    return this.partyPlaylistDbConnection;
  }

  public static getUserDataDao(): UserDataDao {
    if (!this.userDataDao) {
      this.userDataDao = new UserDataDaoDefaultImpl(
        this.getPartyPlaylistDbConnection()
      );
    }

    return this.userDataDao;
  }

  public static getPlaylistDataDao(): PlaylistDataDao {
    if (!this.playlistDataDao) {
      this.playlistDataDao = new PlaylistDataDaoDefaultImpl(
        this.getPartyPlaylistDbConnection()
      );
    }

    return this.playlistDataDao;
  }
}
