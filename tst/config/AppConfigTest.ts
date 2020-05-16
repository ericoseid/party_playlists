const assert = require("assert");
const sinon = require("sinon");

import AppConfig from "../../src/config/AppConfig";

describe("AppConfig", () => {
  const TEST_CONFIG_STRING = '{"test" : "thing"}';
  const s3Retriever = {
    retrieveObject: sinon.stub(),
  };

  afterEach(() => {
    AppConfig.destroy();
  });

  describe("initializeFromS3", () => {
    it("throws an error if the config is already initialized", async () => {
      AppConfig.initializeFromCustomString(TEST_CONFIG_STRING);

      let ok = false;

      try {
        await AppConfig.initializeFromS3(s3Retriever);
      } catch (err) {
        ok = err === "ConfigExists";
      } finally {
        assert.ok(ok);
      }
    });

    it("it throws an exception when the config string is malformed", async () => {
      s3Retriever.retrieveObject
        .withArgs("jam-list-application-store", "jam-list-configuration")
        .returns("{");

      let ok = false;

      try {
        await AppConfig.initializeFromS3(s3Retriever);
      } catch (err) {
        ok = err === "MalformedConfigError";
      } finally {
        assert.ok(ok);
      }
    });

    it("it initializes the config with the s3 response", async () => {
      s3Retriever.retrieveObject
        .withArgs("jam-list-application-store", "jam-list-configuration")
        .returns(TEST_CONFIG_STRING);

      await AppConfig.initializeFromS3(s3Retriever);

      assert.equal("thing", AppConfig.getConfig().test);
    });
  });

  describe("initializeFromCustomConfig", () => {
    it("throws an error if the config already exists", () => {
      AppConfig.initializeFromCustomString("{}");

      let ok = false;

      try {
        AppConfig.initializeFromCustomString("");
      } catch (err) {
        ok = err === "ConfigExists";
      } finally {
        assert.ok(ok);
      }
    });

    it("Throws an error if the JSON is malformatted", () => {
      let ok = false;

      try {
        AppConfig.initializeFromCustomString("{");
      } catch (err) {
        ok = err === "MalformedConfigError";
      } finally {
        assert.ok(ok);
      }
    });

    it("initializes the config with the given json", () => {
      AppConfig.initializeFromCustomString(TEST_CONFIG_STRING);

      assert.equal("thing", AppConfig.getConfig().test);
    });
  });
});
