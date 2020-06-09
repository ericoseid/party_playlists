import assert from "assert";
import sinon from "sinon";
import https from "https";

import GetUserDataApiCaller from "../../../../src/external/spotify/users/GetUserDataApiCaller";
import { EventEmitter } from "events";

describe("GetUserDataApiCaller", () => {
  const AUTH_TOKEN = "authToken";
  const ERROR = `{"status":400,"message":"invalid id"}`;
  const ERRORED_RESPONSE = `{"error":${ERROR}}`;
  const RESPONSE = `{"data":"data"}`;
  let get: any;
  let getRequest: EventEmitter;
  let getResponse: any;
  let apiCaller: SpotifyApiCaller;

  beforeEach(() => {
    get = sinon.stub(https, "get");
    getRequest = new EventEmitter();
    getResponse = new EventEmitter();
    getResponse.setEncoding = sinon.fake();
    apiCaller = new GetUserDataApiCaller();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("call", () => {
    it("Rejects with an error when the http request error out", async () => {
      get.returns(getRequest);

      setImmediate(() => getRequest.emit("error", "error"));

      let ok = false;
      try {
        await apiCaller.call(AUTH_TOKEN, null);
      } catch (err) {
        ok = err === "error";
      } finally {
        assert.ok(ok);
      }
    });

    it("Returns a SpotifyResponse with an error if the response contains an error", async () => {
      get.returns(getRequest).yields(getResponse);

      setImmediate(() => {
        getResponse.emit("data", ERRORED_RESPONSE);
        getResponse.emit("end");
      });

      const spotifyResponse: SpotifyResponse = await apiCaller.call(
        AUTH_TOKEN,
        null
      );

      assert.equal(ERROR, JSON.stringify(spotifyResponse.error));
      assert.ok(!spotifyResponse.data);
    });

    it("Returns a SpotifyResponse with data if the response is successful", async () => {
      get.returns(getRequest).yields(getResponse);

      setImmediate(() => {
        getResponse.emit("data", RESPONSE);
        getResponse.emit("end");
      });

      const spotifyResponse: SpotifyResponse = await apiCaller.call(
        AUTH_TOKEN,
        null
      );

      assert.ok(!spotifyResponse.error);
      assert.equal(RESPONSE, JSON.stringify(spotifyResponse.data));
    });
  });
});
