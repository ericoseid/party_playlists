import { RefreshAndStoreCredentialsDelegate } from "./RefreshAndStoreCredentialsDelegate";
import { UserData } from "../data/UserData";
import { UserDataDao } from "../persistence/userData/UserDataDao";

export default class RefreshAndStoreCredentialDelegateImpl
  implements RefreshAndStoreCredentialsDelegate {
  private readonly credentialRefresher: AccessCredentialRefresher;
  private readonly userDataDao: UserDataDao;

  constructor(
    credentialRefresher: AccessCredentialRefresher,
    userDataDao: UserDataDao
  ) {
    this.credentialRefresher = credentialRefresher;
    this.userDataDao = userDataDao;
  }

  async refreshAndStoreCredentials(userData: UserData): Promise<string> {
    const refreshedToken = await this.getRefreshedAuthToken(userData);

    await this.storeRefreshedToken(userData, refreshedToken);

    return refreshedToken;
  }

  private async getRefreshedAuthToken(userData: UserData): Promise<string> {
    if (!userData.refreshToken) {
      throw new Error("User does not have refresh credentials");
    }

    try {
      const authResponse = await this.credentialRefresher.refreshAccessCredentials(
        userData.refreshToken
      );

      if (authResponse.error || !authResponse.access_token) {
        throw authResponse.error_description;
      }

      return authResponse.access_token;
    } catch (err) {
      const error = new Error("Unable to refresh access credentials");

      error.stack = err;

      throw error;
    }
  }

  private async storeRefreshedToken(
    userData: UserData,
    refreshedToken: string
  ): Promise<void> {
    userData.authToken = refreshedToken;

    try {
      await this.userDataDao.updateUserData(userData);
    } catch (err) {
      const error = new Error("unable to store refreshed credentials");

      error.stack = err;

      throw error;
    }
  }
}
