import CreateAccountRequestHandler from "../../requestHandlers/CreateAccountRequestHandler";
import CompleteAccountRequestHandler from "../../requestHandlers/CompleteAccountRequestHandler";

export default class RequestHandlerDependencies {
  private static createAccountRequestHandler: RequestHandler;
  private static completeAccountRequestHandler: RequestHandler;

  //public static getCreateAccountRequestHandler(): RequestHandler {
  //  if (!this.createAccountRequestHandler) {
  //    this.createAccountRequestHandler = new CreateAccountRequestHandler();
  //  }

  //  return this.createAccountRequestHandler;
  //}

  //public static getCompleteAccountRequestHandler(): RequestHandler {
  //  if (!this.completeAccountRequestHandler) {
  //    this.completeAccountRequestHandler = new CompleteAccountRequestHandler();
  //  }

  //  return this.completeAccountRequestHandler;
  //}
}
