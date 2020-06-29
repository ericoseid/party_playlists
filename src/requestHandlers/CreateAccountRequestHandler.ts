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

  async handle(requestBody: any): Promise<RequestResponse> {
    console.log("Entering Create Account Handler");

    if (!this.isRequestValid(requestBody)) {
      return { statusCode: "400" };
    } else if (await this.doesUserExist(requestBody.userData.username)) {
      return { statusCode: "470" };
    } else if (await this.doesUserEmailExist(requestBody.userData.userEmail)) {
      return { statusCode: "471" };
    }

    return await Promise.all([
      this.hashAndStorePassword(requestBody.userData, requestBody.password),
      this.userDataDao.createUser(requestBody.userData),
    ])
      .then(() => {
        return { statusCode: "200" };
      })
      .catch((err) => {
        console.log(err);

        return { statusCode: "500" };
      });
  }

  private isRequestValid(requestBody: string): boolean {
    if (!isCreateUserRequest(requestBody)) {
      return false;
    }

    return true;
  }

  private async doesUserExist(username: string): Promise<boolean> {
    let users = await this.userDataDao.queryByUsername(username);
    console.log(users);
    return users.length > 0;
  }

  private async doesUserEmailExist(email: string): Promise<boolean> {
    let rows = await this.userDataDao.queryByEmail(email);
    console.log(rows);
    console.log(rows.length);
    return rows.length > 0;
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
