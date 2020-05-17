import { Connection, MysqlError } from "mysql";

export default class PlaylistDataDaoDefaultImpl implements PlaylistDataDao {
  private dbConnection: Connection;

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  queryByPlaylistId(playlistId: string): Promise<PlaylistData> {
    const queryString = `SELECT * FROM user_data WHERE playlistId="${playlistId}";`;

    return new Promise<PlaylistData>((resolve, reject) => {
      this.dbConnection.query(queryString, (err: MysqlError, row) => {
        if (err) {
          reject(err.errno);
        } else {
          resolve(row[0]);
        }
      });
    });
  }
}
