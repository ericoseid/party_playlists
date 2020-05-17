import mysql from "mysql";
import AppConfig from "../../config/AppConfig";

class DatabaseDependencies {
  private static partyPlaylistDbConnection: mysql.Connection;

  public static getPartyPlaylistDbConnection(): mysql.Connection {
    if (!this.partyPlaylistDbConnection) {
      this.partyPlaylistDbConnection = mysql.createConnection(
        AppConfig.getConfig().database.partyPlaylistDbConnectionInfo
      );
    }

    return this.partyPlaylistDbConnection;
  }
}
