export default class CompleteAccountRequestHandler implements RequestHandler {
  async handle(requestBody: any): Promise<RequestResponse> {
    return { statusCode: "234" };
  }
}
