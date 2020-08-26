import UserDataDaoDefaultImpl from "./persistence/userData/impl/UserDataDaoDefaultImpl";
import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "ericoseid",
  password: "TestPass",
  database: "party_playlists_db",
  port: 3306,
  insecureAuth: true,
});

const userDataDao = new UserDataDaoDefaultImpl(connection);

userDataDao.queryByUsername("y").then((userData) => {
  console.log(userData);
  connection.destroy();
});
