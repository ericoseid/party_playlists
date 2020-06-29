import AccessCredentialDefaultRetriever from "../../external/spotify/auth/impl/AccessCredentialRetrieverDefaultImpl";

import AppConfig from "../../../src/config/AppConfig";

export default class SpotifyDependencies {
  private static accessCredentialRetriever: AccessCredentialRetriever;

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
}
