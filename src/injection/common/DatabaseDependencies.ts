import mysql from "mysql";
import AppConfig from "../../config/AppConfig";
import UserDataDaoDefaultImpl from "../../persistence/userData/impl/UserDataDaoDefaultImpl";
import PlaylistDataDaoDefaultImpl from "../../persistence/playlists/impl/PlaylistDataDaoDefaultImpl";
import { UserDataDao } from "../../persistence/userData/UserDataDao";
import { UserPasswordDataDao } from "../../persistence/password/UserPasswordDataDao";
import UserPasswordDataDaoImpl from "../../persistence/password/impl/UserPasswordDataDaoImpl";

export default class DatabaseDependencies {
  private static partyPlaylistDbConnection: mysql.Connection;
  private static userDataDao: UserDataDao;
  private static playlistDataDao: PlaylistDataDao;
  private static userPasswordDataDao: UserPasswordDataDao;

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

  public static getUserPasswordDataDao(): UserPasswordDataDao {
    if (!this.userPasswordDataDao) {
      this.userPasswordDataDao = new UserPasswordDataDaoImpl(
        this.getPartyPlaylistDbConnection()
      );
    }

    return this.userPasswordDataDao;
  }
}
