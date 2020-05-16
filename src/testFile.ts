import S3ObjectRetrieverDefaultImpl from "./external/s3/impl/S3ObjectRetrieverDefaultImpl";
import AWS, { ServerlessApplicationRepository } from "aws-sdk";
import AppConfig from "./config/AppConfig";

const s3: AWS.S3 = new AWS.S3();

const s3Retriever: S3ObjectRetriever = new S3ObjectRetrieverDefaultImpl(s3);

AppConfig.initializeFromS3(s3Retriever).then(() => {
  console.log(AppConfig.getConfig());
});
