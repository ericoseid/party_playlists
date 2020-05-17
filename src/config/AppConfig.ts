import S3ObjectRetrieverDefaultImpl from "../external/s3/impl/S3ObjectRetrieverDefaultImpl";
import AWS from "aws-sdk";

export default class AppConfig {
  private static readonly configBucket: string = "jam-list-application-store";
  private static readonly configKey: string = "jam-list-configuration";
  private static config: any;

  private AppConfig() {}

  public static async initializeFromS3(): Promise<void> {
    this.validateConfigDoesNotExist();

    const s3: AWS.S3 = new AWS.S3();

    const s3Retriever: S3ObjectRetrieverDefaultImpl = new S3ObjectRetrieverDefaultImpl(
      s3
    );

    const configString = await s3Retriever.retrieveObject(
      this.configBucket,
      this.configKey
    );

    this.config = this.parseConfigString(configString);

    console.log(`Loaded Configuration: ${JSON.stringify(this.config)}`);
  }

  public static initializeFromCustomString(customString: string): void {
    this.validateConfigDoesNotExist();

    this.config = this.parseConfigString(customString);
  }

  public static getConfig(): any {
    if (!this.config) {
      throw "config is not initialized";
    }

    return this.config;
  }

  public static destroy(): void {
    this.config = undefined;
  }

  private static validateConfigDoesNotExist() {
    if (this.config) {
      throw "ConfigExists";
    }
  }

  private static parseConfigString(configString: string): Object {
    try {
      return JSON.parse(configString);
    } catch (err) {
      if ("SyntaxError" == err.name) {
        throw "MalformedConfigError";
      } else {
        throw err;
      }
    }
  }
}
