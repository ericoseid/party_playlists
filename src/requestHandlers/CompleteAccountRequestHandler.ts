import { isCompleteUserRequest } from "../data/requests/CompleteUserRequest";
import { UserDataDao } from "../persistence/userData/UserDataDao";
import { UserData } from "../data/UserData";
import GetUserDataApiCaller from "../external/spotify/users/GetUserDataApiCaller";
import { config } from "aws-sdk";

export default class CompleteAccountRequestHandler implements RequestHandler {
  private readonly userDataDao: UserDataDao;
  private readonly credentialRetriever: AccessCredentialRetriever;
  private readonly getUserDataApiCaller: GetUserDataApiCaller;

  constructor(
    userDataDao: UserDataDao,
    credentialRetriever: AccessCredentialRetriever,
    getUserDataApiCaller: GetUserDataApiCaller
  ) {
    this.userDataDao = userDataDao;
    this.credentialRetriever = credentialRetriever;
    this.getUserDataApiCaller = getUserDataApiCaller;
  }

  async handle(requestBody: any): Promise<RequestResponse> {
    if (!isCompleteUserRequest(requestBody)) {
      return { statusCode: "400", body: "Request is not valid" };
    }

    const userDataRows = await this.userDataDao.queryByUsername(
      requestBody.username
    );

    if (userDataRows.length === 0) {
      return { statusCode: "400", body: "User does not exist" };
    }

    const userData: UserData = userDataRows[0];

    let authResponse = await this.credentialRetriever.retrieveAccessCredentials(
      requestBody.authCode
    );

    userData.authToken = authResponse.access_token;
    userData.refreshToken = authResponse.refresh_token;

    const spotifyUserData = await this.getUserDataApiCaller.call(userData);

    userData.spotifyId = spotifyUserData.id;

    this.userDataDao.updateUserData(userData);

    return { statusCode: "200" };
  }
}
