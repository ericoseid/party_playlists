import CreateAccountRequestHandler from "../../requestHandlers/CreateAccountRequestHandler";
import CompleteAccountRequestHandler from "../../requestHandlers/CompleteAccountRequestHandler";
import HashPasswordCallerDefault from "../../external/hashingService/impl/HashPasswordCallerDefault";
import DatabaseDependencies from "../common/DatabaseDependencies";

export default class RequestHandlerDependencies {
  private static createAccountRequestHandler: RequestHandler;
  private static completeAccountRequestHandler: RequestHandler;
  private static hashPasswordCaller: HashPasswordCaller;

  public static getCreateAccountRequestHandler(): RequestHandler {
    if (!this.createAccountRequestHandler) {
      this.createAccountRequestHandler = new CreateAccountRequestHandler(
        this.getHashPasswordCaller(),
        DatabaseDependencies.getUserDataDao(),
        DatabaseDependencies.getUserPasswordDataDao()
      );
    }

    return this.createAccountRequestHandler;
  }

  //public static getCompleteAccountRequestHandler(): RequestHandler {
  //  if (!this.completeAccountRequestHandler) {
  //    this.completeAccountRequestHandler = new CompleteAccountRequestHandler();
  //  }

  //  return this.completeAccountRequestHandler;
  //}

  public static getHashPasswordCaller(): HashPasswordCaller {
    if (!this.hashPasswordCaller) {
      this.hashPasswordCaller = new HashPasswordCallerDefault();
    }

    return this.hashPasswordCaller;
  }
}
