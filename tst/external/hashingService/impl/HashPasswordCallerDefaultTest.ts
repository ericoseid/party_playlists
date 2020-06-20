import assert from "assert";
import sinon from "sinon";
import http from "http";

import HashPasswordCallerDefault from "../../../../src/external/hashingService/impl/HashPasswordCallerDefault";
import { EventEmitter } from "events";

describe("HashPasswordCallerDefault", () => {
  const PASSWORD = "password";
  const POST_DATA = `{"password":"${PASSWORD}"}`;
  const REQUEST_OPTIONS = {
    hostname: "::1",
    port: 8000,
    path: "/hash/password",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const RESPONSE = '{"body":"data"}';

  let httpRequest: any;
  let request: any;
  let response: any;
  let caller = new HashPasswordCallerDefault();

  beforeEach(() => {
    httpRequest = sinon.stub(http, "request");
    request = new EventEmitter();
    request.write = sinon.mock();
    request.end = sinon.mock();
    response = new EventEmitter();
    response.setEncoding = sinon.mock();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("callHashPassword", () => {
    describe("when the request fails", () => {
      it("throws an exception", async () => {
        httpRequest
          .withArgs(REQUEST_OPTIONS, sinon.match.func)
          .returns(request);
        request.write.withArgs(POST_DATA);

        setImmediate(() => {
          request.emit("error", "error");
        });

        let ok = false;

        try {
          await caller.callHashPassword(PASSWORD);
        } catch (err) {
          ok = err === "error";
        } finally {
          assert.ok(ok);
          assert.ok(request.end.once());
        }
      });
    });

    describe("when the request succeeds", () => {
      it("returns the response", async () => {
        httpRequest
          .withArgs(REQUEST_OPTIONS, sinon.match.func)
          .returns(request)
          .yields(response);
        request.write.withArgs(POST_DATA);

        setImmediate(() => {
          response.setEncoding.withArgs("utf8");
          response.emit("data", RESPONSE);
          response.emit("end");
        });

        const res = await caller.callHashPassword(PASSWORD);

        assert.equal("data", res);
        assert.ok(request.end.once());
      });
    });
  });
});
