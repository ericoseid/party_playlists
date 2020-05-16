import aws from "aws-sdk";

export default class S3ObjectRetrieverDefaultImpl implements S3ObjectRetriever {
  private s3Client: aws.S3;

  constructor(s3Client: aws.S3) {
    this.s3Client = s3Client;
  }

  retrieveObject(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    return new Promise<string>((resolve, reject) => {
      this.s3Client.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else if (!data.Body) {
          reject("Body is null in response");
        } else {
          resolve(data.Body.toString("utf-8"));
        }
      });
    });
  }
}
