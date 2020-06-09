import assert from "assert";
import sinon from "sinon";
import https from "https";
import AccessCredentialRetrieverDefaultImpl from "../../../../../src/external/spotify/auth/impl/AccessCredentialRetrieverDefaultImpl";
import { EventEmitter } from "events";

describe("AccessCredentialRetrieverDefaultImpl", () => {
  const CLIENT_ID = "clientId";
  const CLIENT_SECRET = "clientSecret";
  const AUTH_CODE = "authCode";
  const POST_DATA =
    "grant_type=authorization_code&code=authCode&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2FCompleteAccount&client_id=clientId&client_secret=clientSecret";
  const REQUEST_OPTIONS = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": POST_DATA.length,
    },
  };
  const SUCCESSFUL_RESPONSE =
    '{ "access_token" : "accessToken", "refresh_token" : "refreshToken", "scope" : "scope" }';
  const ERRORED_RESPONSE =
    '{ "error" : "error", "error_description" : "errorDescription" }';

  let httpRequest: any;
  let requestMock: any;
  let responseMock: any;
  let retriever: AccessCredentialRetriever;

  beforeEach(() => {
    httpRequest = sinon.stub(https, "request");

    requestMock = new EventEmitter();
    requestMock.write = sinon.fake();
    requestMock.end = sinon.fake();

    responseMock = new EventEmitter();
    responseMock.setEncoding = sinon.fake();

    retriever = new AccessCredentialRetrieverDefaultImpl(
      CLIENT_ID,
      CLIENT_SECRET
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("retrieveAccessCredentials", () => {
    it("Rejects with an error when the http call fails", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock);
      setImmediate(() => {
        requestMock.emit("error", "error");
      });

      let ok = false;
      try {
        await retriever.retrieveAccessCredentials(AUTH_CODE);
      } catch (err) {
        ok = err === "error";
      } finally {
        assert.ok(ok);
      }
    });

    it("Returns an errored authentication response when the request fails", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock)
        .yields(responseMock);
      setImmediate(() => {
        responseMock.emit("data", ERRORED_RESPONSE);
        responseMock.emit("end");
      });

      const response = await retriever.retrieveAccessCredentials(AUTH_CODE);

      assert.ok(response.access_token === undefined);
      assert.ok(response.refresh_token === undefined);
      assert.equal("error", response.error);
      assert.equal("errorDescription", response.error_description);
    });

    it("Returns an authentication response when the request succeeds", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock)
        .yields(responseMock);
      setImmediate(() => {
        responseMock.emit("data", SUCCESSFUL_RESPONSE);
        responseMock.emit("end");
      });

      const response = await retriever.retrieveAccessCredentials(AUTH_CODE);

      assert.equal("accessToken", response.access_token);
      assert.equal("refreshToken", response.refresh_token);
      assert.ok(response.error === undefined);
      assert.ok(response.error_description === undefined);
    });
  });
});
