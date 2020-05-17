import S3ObjectRetrieverDefaultImpl from "../../external/s3/impl/S3ObjectRetrieverDefaultImpl";
import AWS from "aws-sdk";

class AwsDependencies {
  private static s3ObjectRetriever: S3ObjectRetriever;
  private static s3Client: AWS.S3;

  public static getS3ObjectRetriever(): S3ObjectRetriever {
    if (this.s3ObjectRetriever) {
      this.s3ObjectRetriever = new S3ObjectRetrieverDefaultImpl(
        this.getS3Client()
      );
    }

    return this.s3ObjectRetriever;
  }

  public static getS3Client(): AWS.S3 {
    if (!this.s3Client) {
      this.s3Client = new AWS.S3();
    }

    return this.s3Client;
  }
}
