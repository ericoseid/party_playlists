interface RequestHandler {
  handle: (requestBody: string) => Promise<RequestResponse>;
}
