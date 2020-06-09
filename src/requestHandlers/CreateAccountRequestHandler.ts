export default class CreateAccountRequestHandler implements RequestHandler {
  async handle(requestBody: any): Promise<number> {
    console.log(isUserData({}));
    return 10;
  }
}
