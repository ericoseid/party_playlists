import assert from "assert";
import sinon from "sinon";
import https from "https";

import AccessCredentialRefresherDefaultImpl from "../../../../../src/external/spotify/auth/impl/AccessCredentialRefresherDefaultImpl";
import { EventEmitter } from "events";

describe("AccessCredentialRefresherDefaultImpl", () => {
  const CLIENT_ID: string = "clientId";
  const CLIENT_SECRET: string = "clientSecret";
  const REFRESH_TOKEN: string = "refreshToken";
  const POST_DATA: string =
    "grant_type=refresh_token&refresh_token=refreshToken";
  const BASE_64_CREDENTIALS: string = "Y2xpZW50SWQ6Y2xpZW50U2VjcmV0";
  const REQUEST_OPTIONS = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": POST_DATA.length,
      Authorization: `Basic ${BASE_64_CREDENTIALS}`,
    },
  };
  const SUCCESSFUL_RESPONSE =
    '{ "access_token" : "accessToken", "refresh_token" : "refreshToken", "scope" : "scope" }';
  const ERRORED_RESPONSE =
    '{ "error" : "error", "error_description" : "errorDescription" }';

  let httpRequest: any;
  let requestMock: any;
  let responseMock: any;
  let refresher: AccessCredentialRefresher;

  beforeEach(() => {
    httpRequest = sinon.stub(https, "request");
    requestMock = new EventEmitter();
    requestMock.write = sinon.fake();
    requestMock.end = sinon.fake();
    responseMock = new EventEmitter();
    responseMock.setEncoding = sinon.fake();
    refresher = new AccessCredentialRefresherDefaultImpl(
      CLIENT_ID,
      CLIENT_SECRET
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("refreshAccessCredentials", () => {
    it("rejects with an error when the http call fails", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock);
      setImmediate(() => {
        requestMock.emit("error", "error");
      });

      let ok = false;
      try {
        await refresher.refreshAccessCredentials(REFRESH_TOKEN);
      } catch (err) {
        ok = err === "error";
      } finally {
        assert.ok(ok);
      }
    });

    it("returns an errored auth response if the request fails", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock)
        .yields(responseMock);
      setImmediate(() => {
        responseMock.emit("data", ERRORED_RESPONSE);
        responseMock.emit("end");
      });

      const response = await refresher.refreshAccessCredentials(REFRESH_TOKEN);

      assert.ok(response.access_token === undefined);
      assert.ok(response.refresh_token === undefined);
      assert.equal("error", response.error);
      assert.equal("errorDescription", response.error_description);
    });

    it("returns an errored auth response if the request fails", async () => {
      httpRequest
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestMock)
        .yields(responseMock);
      setImmediate(() => {
        responseMock.emit("data", SUCCESSFUL_RESPONSE);
        responseMock.emit("end");
      });

      const response = await refresher.refreshAccessCredentials(REFRESH_TOKEN);

      assert.equal("accessToken", response.access_token);
      assert.equal("refreshToken", response.refresh_token);
      assert.ok(response.error === undefined);
      assert.ok(response.error_description === undefined);
    });
  });
});
