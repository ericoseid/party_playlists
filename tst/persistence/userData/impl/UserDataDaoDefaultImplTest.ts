import assert from "assert";
import sinon from "sinon";
import { Connection } from "mysql";

import UserDataDaoDefaultImpl from "../../../../src/persistence/userData/impl/UserDataDaoDefaultImpl";

describe("UserDataDefaultImpl", () => {
  const USER_DATA: UserData = {
    username: "name",
    userEmail: "email",
    creationDate: new Date(),
  };
  const USER_DATA_ROW = {
    username: "name",
    userEmail: "email",
    spotifyId: "spotifyId",
    authToken: "authToken",
    refreshToken: "refreshToken",
    creationDate: new Date(0),
  };
  const CREATE_QUERY_STRING =
    "INSERT INTO user_data (username, userEmail, spotifyId, authToken, refreshToken, creationDate) VALUES (?, ?, ?, ?, ?, ?);";
  const CREATE_VALUE_LIST = [
    "name",
    "email",
    undefined,
    undefined,
    undefined,
    sinon.match.date,
  ];
  const UPDATE_QUERY_STRING =
    'UPDATE user_data SET userEmail=? WHERE username="name";';
  const UPDATE_VALUE_LIST = ["email"];
  const QUERY_QUERY_STRING = 'SELECT * FROM user_data WHERE username="name";';
  let dbConnection: any;
  let daoImpl: UserDataDaoDefaultImpl;

  beforeEach(() => {
    dbConnection = <Connection>(<unknown>{
      query: sinon.stub(),
    });
    daoImpl = new UserDataDaoDefaultImpl(dbConnection);
  });

  describe("createUser", () => {
    it("throws the error code when the query fails", async () => {
      dbConnection.query
        .withArgs(
          CREATE_QUERY_STRING,
          sinon.match(CREATE_VALUE_LIST),
          sinon.match.func
        )
        .yields({ errno: 123 });

      let ok = false;
      try {
        await daoImpl.createUser(USER_DATA);
      } catch (err) {
        ok = err === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("resolves when the query succeeds", async () => {
      dbConnection.query
        .withArgs(
          CREATE_QUERY_STRING,
          sinon.match(CREATE_VALUE_LIST),
          sinon.match.func
        )
        .yields(null);

      await daoImpl.createUser(USER_DATA);
    });
  });

  describe("updateUserData", () => {
    it("Throws an error number if the query fails", async () => {
      dbConnection.query
        .withArgs(
          UPDATE_QUERY_STRING,
          sinon.match(UPDATE_VALUE_LIST),
          sinon.match.func
        )
        .yields({ errno: 123 });

      let ok = false;
      try {
        await daoImpl.updateUserData(USER_DATA);
      } catch (err) {
        ok = err === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("Filters out the username/creationDate and resolves", async () => {
      dbConnection.query
        .withArgs(
          UPDATE_QUERY_STRING,
          sinon.match(UPDATE_VALUE_LIST),
          sinon.match.func
        )
        .yields(null);

      await daoImpl.updateUserData(USER_DATA);
    });
  });

  describe("queryUserData", () => {
    it("throws an error code if the query fails", async () => {
      dbConnection.query
        .withArgs(QUERY_QUERY_STRING, sinon.match.func)
        .yields({ errno: 123 });

      let ok = false;
      try {
        await daoImpl.queryByUsername("name");
      } catch (err) {
        ok = err === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("Returns a UserData object if the query is successful", async () => {
      dbConnection.query
        .withArgs(QUERY_QUERY_STRING, sinon.match.func)
        .yields(null, [USER_DATA_ROW]);

      assert.equal(USER_DATA_ROW, await daoImpl.queryByUsername("name"));
    });
  });
});
