import assert from "assert";
import sinon from "sinon";
import { Connection } from "mysql";

import UserPasswordDataDaoImpl from "../../../../src/persistence/password/impl/UserPasswordDataDaoImpl";

describe("UserPasswordDataDaoImpl", () => {
  const USERNAME = "username";
  const USER_DATA = { username: USERNAME };
  const PASSWORD = "password";
  const CREATE_QUERY =
    "insert into UserPassword (username, password) values (?, ?);";
  const GET_QUERY = "select * from UserPassword where username=?;";
  const CREATE_QUERY_VALUES = [USERNAME, PASSWORD];
  const GET_QUERY_VALUES = [USERNAME];
  const USER_PASSWORD_DATA = { username: USERNAME, password: PASSWORD };
  let connection: any;
  let dao: UserPasswordDataDao;

  beforeEach(() => {
    connection = <Connection>(<unknown>{
      query: sinon.stub(),
    });
    dao = new UserPasswordDataDaoImpl(connection);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUserPassword", () => {
    it("It throws an exception if the query fails", async () => {
      connection.query
        .withArgs(
          CREATE_QUERY,
          sinon.match(CREATE_QUERY_VALUES),
          sinon.match.func
        )
        .yields({ errno: 123 });

      let ok = false;

      try {
        await dao.createUserPassword(USER_DATA, PASSWORD);
      } catch (e) {
        ok = e.errno === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("Resolves when the query succeeds", async () => {
      connection.query
        .withArgs(
          CREATE_QUERY,
          sinon.match(CREATE_QUERY_VALUES),
          sinon.match.func
        )
        .yields(null);

      await dao.createUserPassword(USER_DATA, PASSWORD);
    });
  });

  describe("getUserPassword", () => {
    it("Rejects with an error when the query fails", async () => {
      connection.query
        .withArgs(GET_QUERY, GET_QUERY_VALUES, sinon.match.func)
        .yields(null, { errno: 123 });

      let ok = false;

      try {
        await dao.getUserPassword(USERNAME);
      } catch (err) {
        ok = err.errno === 123;
      } finally {
        assert.ok(ok);
      }
    });

    it("Returns a user data object when the query succeeds", async () => {
      connection.query
        .withArgs(GET_QUERY, GET_QUERY_VALUES, sinon.match.func)
        .yields([USER_PASSWORD_DATA], null);

      let userPasswordData = await dao.getUserPassword(USERNAME);

      assert.equal(USERNAME, userPasswordData.username);
      assert.equal(PASSWORD, userPasswordData.password);
    });
  });
});
