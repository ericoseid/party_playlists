import mysql from "mysql";

export default class UserPasswordDataDaoImpl implements UserPasswordDataDao {
  private static readonly CREATE_QUERY =
    "insert into UserPassword (username, password) values (?, ?);";
  private static readonly GET_QUERY =
    "select * from UserPassword where username=?;";

  private dbConnection: mysql.Connection;

  constructor(dbConnection: mysql.Connection) {
    this.dbConnection = dbConnection;
  }

  createUserPassword(userData: UserData, password: string): Promise<void> {
    const queryValues = [userData.username, password];

    return new Promise<void>((resolve, reject) => {
      this.dbConnection.query(
        UserPasswordDataDaoImpl.CREATE_QUERY,
        queryValues,
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  getUserPassword(username: string): Promise<UserPasswordData> {
    const queryValues = [username];
    return new Promise<UserPasswordData>((resolve, reject) => {
      this.dbConnection.query(
        UserPasswordDataDaoImpl.GET_QUERY,
        queryValues,
        (rows: any, err) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows[0]);
          }
        }
      );
    });
  }
}
