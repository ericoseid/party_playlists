import assert from "assert";
import sinon from "sinon";

import CreateAccountRequestHandler from "../../src/requestHandlers/CreateAccountRequestHandler";
import { UserPasswordDataDao } from "../persistence/password/UserPasswordDataDao";
import { UserDataDao } from "../persistence/userData/UserDataDao";

describe("CreateAccountRequestHander", () => {
  const PASSWORD = "password";
  const HASHED_PASSWORD = "hashedPassword";
  const INVALID_JSON_REQUEST = "{";
  const INVALID_REQUEST = '{"field" : "data" }';
  const REQUEST = `{ "userData" : { "username" : "username", "userEmail" : "email" }, "password" : "${PASSWORD}" }`;

  let hashPasswordCaller: any;
  let userPasswordDataDao: any;
  let userDataDao: any;
  let requestHandler: CreateAccountRequestHandler;

  beforeEach(() => {
    hashPasswordCaller = <HashPasswordCaller>(<any>{
      callHashPassword: sinon.stub(),
    });

    userDataDao = <UserDataDao>(<any>{
      createUser: sinon.stub(),
    });

    userPasswordDataDao = <UserPasswordDataDao>(<any>{
      createUserPassword: sinon.stub(),
    });

    requestHandler = new CreateAccountRequestHandler(
      hashPasswordCaller,
      userDataDao,
      userPasswordDataDao
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("handle", () => {
    describe("when the request body is not valid JSON", () => {
      it("returns an invalid request response object", async () => {
        const response = await requestHandler.handle(INVALID_JSON_REQUEST);

        assert.strictEqual("400", response.statusCode);
        assert.ok(!response.body);
      });
    });

    describe("when the request body is not a valid request", () => {
      it("returns an invalid request response object", async () => {
        const response = await requestHandler.handle(INVALID_REQUEST);

        assert.strictEqual("400", response.statusCode);
        assert.ok(!response.body);
      });
    });

    describe("when the hashing service call fails", () => {
      it("returns a 500 status code response object", async () => {
        hashPasswordCaller.callHashPassword.withArgs(PASSWORD).throws();

        let response = await requestHandler.handle(REQUEST);

        assert.strictEqual("500", response.statusCode);
        assert.ok(!response.body);
      });
    });

    describe("when the user password data dao call fails", () => {
      it("returns a 500 status code response object", async () => {
        hashPasswordCaller.callHashPassword
          .withArgs(PASSWORD)
          .returns(HASHED_PASSWORD);
        userPasswordDataDao.createUserPassword
          .withArgs(sinon.match.any, sinon.match(HASHED_PASSWORD))
          .throws();

        let response = await requestHandler.handle(REQUEST);

        assert.strictEqual("500", response.statusCode);
        assert.ok(!response.body);
      });
    });

    describe("when the user data dao call fails", () => {
      it("returns a 500 status code response object", async () => {
        hashPasswordCaller.callHashPassword
          .withArgs(PASSWORD)
          .returns(HASHED_PASSWORD);
        userPasswordDataDao.createUserPassword
          .withArgs(sinon.match.any, sinon.match(HASHED_PASSWORD))
          .returns();
        userDataDao.createUser.returns(Promise.reject());

        let response = await requestHandler.handle(REQUEST);

        assert.strictEqual("500", response.statusCode);
        assert.ok(!response.body);
      });
    });

    describe("when all of the calls succeed", () => {
      it("returns a 200 status code response object", async () => {
        hashPasswordCaller.callHashPassword
          .withArgs(PASSWORD)
          .returns(HASHED_PASSWORD);
        userPasswordDataDao.createUserPassword
          .withArgs(sinon.match.any, sinon.match(HASHED_PASSWORD))
          .returns();
        userDataDao.createUser.returns();

        let response = await requestHandler.handle(REQUEST);

        assert.strictEqual("200", response.statusCode);
        assert.ok(!response.body);
      });
    });
  });
});
