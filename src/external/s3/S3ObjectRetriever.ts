interface S3ObjectRetriever {
  retrieveObject: (bucket: string, key: string) => Promise<string>;
}
