import S3ObjectRetrieverDefaultImpl from "../../../../src/external/s3/impl/S3ObjectRetrieverDefaultImpl";

const assert = require("assert");
const sinon = require("sinon");
const aws = require("aws-sdk");

describe("S3ObjectRetrieverDefaultImpl", () => {
  const BUCKET = "bucket";
  const KEY = "key";
  const PARAMS = {
    Bucket: BUCKET,
    Key: KEY,
  };
  const ERROR = "error";

  let s3Constructor;
  let s3: any;
  let retriever: S3ObjectRetrieverDefaultImpl;

  beforeEach(() => {
    s3Constructor = sinon.stub(aws, "S3");

    s3 = {
      getObject: sinon.stub(),
    };

    s3Constructor.returns(s3);

    retriever = new S3ObjectRetrieverDefaultImpl(s3);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("retrieve object", () => {
    it("rejects with an error when the get object fails", async () => {
      s3.getObject.withArgs(PARAMS, sinon.match.func).yields(ERROR, undefined);

      let ok = false;

      try {
        await retriever.retrieveObject(BUCKET, KEY);
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });

    it("rejects with an error when the response has no body", async () => {
      s3.getObject.withArgs(PARAMS, sinon.match.func).yields(undefined, {});

      let ok = false;

      try {
        await retriever.retrieveObject(BUCKET, KEY);
      } catch (err) {
        ok = true;
      } finally {
        assert.ok(ok);
      }
    });

    it("returns the response body when the call is successful", async () => {
      s3.getObject
        .withArgs(PARAMS, sinon.match.func)
        .yields(undefined, { Body: "body" });

      const response = await retriever.retrieveObject(BUCKET, KEY);

      assert.equal("body", response);
    });
  });
});
