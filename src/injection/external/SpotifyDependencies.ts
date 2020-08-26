import AccessCredentialDefaultRetriever from "../../external/spotify/auth/impl/AccessCredentialRetrieverDefaultImpl";

import AppConfig from "../../../src/config/AppConfig";
import GetUserDataApiCaller from "../../external/spotify/users/GetUserDataApiCaller";
import { SpotifyApiCaller } from "../../external/spotify/SpotifyApiCaller";
import SpotifyApiCallerDefaultImpl from "../../external/spotify/SpotifyApiCallerDefaultImpl";
import { RefreshAndStoreCredentialsDelegate } from "../../tasks/RefreshAndStoreCredentialsDelegate";
import RefreshAndStoreCredentialDelegateImpl from "../../tasks/RefreshAndStoreCredentialDelegateImpl";
import AccessCredentialRefresherDefaultImpl from "../../external/spotify/auth/impl/AccessCredentialRefresherDefaultImpl";
import DatabaseDependencies from "../common/DatabaseDependencies";

export default class SpotifyDependencies {
  private static accessCredentialRetriever: AccessCredentialRetriever;
  private static accessCredentialRefresher: AccessCredentialRefresher;
  private static refreshAndStoreAccessCredentials: RefreshAndStoreCredentialsDelegate;
  private static getUserDataApiCaller: GetUserDataApiCaller;
  private static spotifyApiCaller: SpotifyApiCaller;

  public static getAccessCredentialRetriever(): AccessCredentialRetriever {
    let config = AppConfig.getConfig();

    if (!this.accessCredentialRetriever) {
      this.accessCredentialRetriever = new AccessCredentialDefaultRetriever(
        config.spotify.clientId,
        config.spotify.clientSecret
      );
    }

    return this.accessCredentialRetriever;
  }

  public static getAccessCredentialRefresher(): AccessCredentialRefresher {
    const config = AppConfig.getConfig();

    if (!this.accessCredentialRefresher) {
      this.accessCredentialRefresher = new AccessCredentialRefresherDefaultImpl(
        config.spotify.clientId,
        config.spotify.clientSecret
      );
    }

    return this.accessCredentialRefresher;
  }

  public static getRefreshAndStoreAccessCredentials(): RefreshAndStoreCredentialsDelegate {
    if (!this.refreshAndStoreAccessCredentials) {
      this.refreshAndStoreAccessCredentials = new RefreshAndStoreCredentialDelegateImpl(
        this.getAccessCredentialRefresher(),
        DatabaseDependencies.getUserDataDao()
      );
    }

    return this.refreshAndStoreAccessCredentials;
  }

  public static getGetUserDataApiCaller(): GetUserDataApiCaller {
    if (!this.getUserDataApiCaller) {
      this.getUserDataApiCaller = new GetUserDataApiCaller(
        this.getSpotifyApiCaller()
      );
    }

    return this.getUserDataApiCaller;
  }

  public static getSpotifyApiCaller(): SpotifyApiCaller {
    if (!this.spotifyApiCaller) {
      this.spotifyApiCaller = new SpotifyApiCallerDefaultImpl(
        this.getRefreshAndStoreAccessCredentials()
      );
    }

    return this.spotifyApiCaller;
  }
}
