import assert from "assert";
import sinon from "sinon";
import https from "https";

import SpotifyApiCallerDefaultImpl from "../../../src/external/spotify/SpotifyApiCallerDefaultImpl";
import { EventEmitter } from "events";

describe("SpotifyApiCallerDefaultImpl", () => {
  const REQUEST_OPTIONS = { key: "value" };
  const REQUEST_BODY = { key: "value" };
  const RESPONSE = '{ "response": "response" }';

  let request: any;
  let requestObject: any;
  let responseObject: any;
  let refresher: AccessCredentialRefresher;
  let apiCaller: SpotifyApiCaller;

  beforeEach(() => {
    request = sinon.stub(https, "request");
    requestObject = new EventEmitter();
    requestObject.write = sinon.fake();
    requestObject.end = sinon.fake();
    responseObject = new EventEmitter();
    responseObject.setEncoding = sinon.fake();
    refresher = {
      refreshAccessCredentials: sinon.stub(),
    };
    apiCaller = new SpotifyApiCallerDefaultImpl(refresher);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("call", () => {
    it("Throws an error when the https call fails", async () => {
      request
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestObject);
      setImmediate(() => {
        requestObject.emit("error", "error");
      });

      let ok = false;
      try {
        await apiCaller.call(REQUEST_OPTIONS, null);
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });

    it("Does not write to the request if the request object is null in the request", async () => {
      request
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestObject)
        .yields(responseObject);
      setImmediate(() => {
        responseObject.emit("data", RESPONSE);
        responseObject.emit("end");
      });

      await apiCaller.call(REQUEST_OPTIONS, null);

      assert.ok(requestObject.write.notCalled);
    });

    it("Does write to the request if the request is non null", async () => {
      request
        .withArgs(REQUEST_OPTIONS, sinon.match.func)
        .returns(requestObject)
        .yields(responseObject);
      setImmediate(() => {
        responseObject.emit("data", RESPONSE);
        responseObject.emit("end");
      });

      await apiCaller.call(REQUEST_OPTIONS, REQUEST_BODY);

      assert.ok(requestObject.write.calledOnce);
    });
  });
});
