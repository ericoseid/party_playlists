import mysql from "mysql";
import { UserData } from "../../../data/UserData";
import { UserDataDao } from "../UserDataDao";

export default class UserDataDaoDefaultImpl implements UserDataDao {
  private dbConnection: mysql.Connection;

  constructor(dbConnection: mysql.Connection) {
    this.dbConnection = dbConnection;
  }

  createUser(userData: UserData): Promise<void> {
    const queryValues = [
      userData.username,
      userData.userEmail,
      userData.spotifyId,
      userData.authToken,
      userData.refreshToken,
      new Date(),
    ];

    const queryString =
      "INSERT INTO user_data (username, userEmail, spotifyId, authToken, refreshToken, creationDate) VALUES (?, ?, ?, ?, ?, ?);";

    return new Promise<void>((resolve, reject) => {
      this.dbConnection.query(queryString, queryValues, (err) => {
        if (err) {
          reject(err.errno);
        } else {
          resolve();
        }
      });
    });
  }

  updateUserData(userData: UserData) {
    const updatedColumnStrings: string[] = [];
    const updatedValues: any[] = [];

    Object.entries(userData)
      .filter((entry) => entry[0] != "username" && entry[0] != "creationDate")
      .forEach((entry) => {
        updatedColumnStrings.push(`${entry[0]}=?`);
        updatedValues.push(entry[1]);
      });

    const queryString: string = `UPDATE user_data SET ${updatedColumnStrings.join(
      ","
    )} WHERE username="${userData.username}";`;

    return new Promise<void>((resolve, reject) => {
      this.dbConnection.query(queryString, updatedValues, (err) => {
        if (err) {
          reject(err.errno);
        } else {
          resolve();
        }
      });
    });
  }

  queryByUsername(username: String) {
    const queryString = `SELECT * FROM user_data WHERE username="${username}";`;

    return new Promise<UserData>((resolve, reject) => {
      this.dbConnection.query(queryString, (err, row) => {
        if (err) {
          reject(err.errno);
        } else {
          resolve(row[0]);
        }
      });
    });
  }
}
