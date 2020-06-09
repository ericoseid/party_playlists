interface RequestHandler {
  handle: (requestBody: any) => Promise<number>;
}
