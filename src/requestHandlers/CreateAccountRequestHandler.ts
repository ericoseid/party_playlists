import { isCreateUserRequest } from "../data/requests/CreateUserRequest";
import { UserData } from "../data/UserData";
import { UserPasswordDataDao } from "../persistence/password/UserPasswordDataDao";
import { UserDataDao } from "../persistence/userData/UserDataDao";

export default class CreateAccountRequestHandler implements RequestHandler {
  private readonly hashPasswordCaller: HashPasswordCaller;
  private readonly userDataDao: UserDataDao;
  private readonly userPasswordDataDao: UserPasswordDataDao;

  constructor(
    hashPasswordCaller: HashPasswordCaller,
    userDataDao: UserDataDao,
    userPasswordDataDao: UserPasswordDataDao
  ) {
    this.hashPasswordCaller = hashPasswordCaller;
    this.userDataDao = userDataDao;
    this.userPasswordDataDao = userPasswordDataDao;
  }

  async handle(requestBody: string): Promise<RequestResponse> {
    if (!this.isRequestValid(requestBody)) {
      return { statusCode: "400" };
    }

    const requestObject = JSON.parse(requestBody);

    return await Promise.all([
      this.hashAndStorePassword(requestObject.userData, requestObject.password),
      this.userDataDao.createUser(requestObject.userData),
    ])
      .then(() => {
        return { statusCode: "200" };
      })
      .catch(() => {
        return { statusCode: "500" };
      });
  }

  private isRequestValid(requestBody: string): boolean {
    let requestObject;
    try {
      requestObject = JSON.parse(requestBody);
    } catch (err) {
      return false;
    }

    if (!isCreateUserRequest(requestObject)) {
      return false;
    }

    return true;
  }

  private async hashAndStorePassword(
    userData: UserData,
    password: string
  ): Promise<void> {
    const hashedPassword = await this.hashPasswordCaller.callHashPassword(
      password
    );

    await this.userPasswordDataDao.createUserPassword(userData, hashedPassword);
  }
}
