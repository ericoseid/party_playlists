import AccessCredentialDefaultRetriever from "../../external/spotify/auth/impl/AccessCredentialRetrieverDefaultImpl";

import AppConfig from "../../../src/config/AppConfig";
import GetUserDataApiCaller from "../../external/spotify/users/GetUserDataApiCaller";
import { SpotifyApiCaller } from "../../external/spotify/SpotifyApiCaller";
import SpotifyApiCallerDefaultImpl from "../../external/spotify/SpotifyApiCallerDefaultImpl";
import { RefreshAndStoreCredentialsDelegate } from "../../tasks/RefreshAndStoreCredentialsDelegate";
import RefreshAndStoreCredentialDelegateImpl from "../../tasks/RefreshAndStoreCredentialDelegateImpl";
import AccessCredentialRefresherDefaultImpl from "../../external/spotify/auth/impl/AccessCredentialRefresherDefaultImpl";
import DatabaseDependencies from "../common/DatabaseDependencies";
import { GetUserPlaylistsApiCaller } from "../../external/spotify/playlists/GetUserPlaylistsApiCaller";
import { SpotifyResponseHandler } from "../../external/spotify/SpotifyResponseHandler";
import { SpotifyResponseHandlerImpl } from "../../external/spotify/SpotifyResponseHandlerImpl";
import { GetUserPlaylistApiCallerDefaulImpl } from "../../external/spotify/playlists/impl/GetUserPlaylistsApiCallerDefaultImpl";
import { GetPlaylistTracksApiCaller } from "../../external/spotify/playlists/GetPlaylistTracksApiCaller";
import GetPlaylistTracksApiCallerImpl from "../../external/spotify/playlists/impl/GetPlaylistTracksApiCallerImpl";
import { AddTrackToPlaylistApiCaller } from "../../external/spotify/playlists/AddTrackToPlaylistApiCaller";
import AddTrackToPlaylistApiCallerDefaultImpl from "../../external/spotify/playlists/impl/AddTrackToPlaylistApiCallerDefaulImpl";

export default class SpotifyDependencies {
  private static accessCredentialRetriever: AccessCredentialRetriever;
  private static accessCredentialRefresher: AccessCredentialRefresher;
  private static refreshAndStoreAccessCredentials: RefreshAndStoreCredentialsDelegate;
  private static getUserDataApiCaller: GetUserDataApiCaller;
  private static getUserPlaylistsApiCaller: GetUserPlaylistsApiCaller;
  private static getPlaylistTracksApiCaller: GetPlaylistTracksApiCaller;
  private static addTrackToPlaylistApiCaller: AddTrackToPlaylistApiCaller;
  private static spotifyApiCaller: SpotifyApiCaller;
  private static spotifyResponseHandler: SpotifyResponseHandler;

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

  public static getGetUserPlaylistsApiCaller(): GetUserPlaylistsApiCaller {
    if (!this.getUserPlaylistsApiCaller) {
      this.getUserPlaylistsApiCaller = new GetUserPlaylistApiCallerDefaulImpl(
        this.getSpotifyApiCaller(),
        this.getSpotifyResponseHandler()
      );
    }

    return this.getUserPlaylistsApiCaller;
  }

  public static getGetPlaylistTracksApiCaller(): GetPlaylistTracksApiCaller {
    if (!this.getPlaylistTracksApiCaller) {
      this.getPlaylistTracksApiCaller = new GetPlaylistTracksApiCallerImpl(
        this.getSpotifyApiCaller(),
        this.getSpotifyResponseHandler()
      );
    }

    return this.getPlaylistTracksApiCaller;
  }

  public static getAddTrackToPlaylistApiCaller(): AddTrackToPlaylistApiCaller {
    if (!this.addTrackToPlaylistApiCaller) {
      this.addTrackToPlaylistApiCaller = new AddTrackToPlaylistApiCallerDefaultImpl(
        this.getSpotifyApiCaller(),
        this.getSpotifyResponseHandler()
      );
    }

    return this.addTrackToPlaylistApiCaller;
  }

  public static getSpotifyApiCaller(): SpotifyApiCaller {
    if (!this.spotifyApiCaller) {
      this.spotifyApiCaller = new SpotifyApiCallerDefaultImpl(
        this.getRefreshAndStoreAccessCredentials()
      );
    }

    return this.spotifyApiCaller;
  }

  public static getSpotifyResponseHandler(): SpotifyResponseHandler {
    if (!this.spotifyResponseHandler) {
      this.spotifyResponseHandler = new SpotifyResponseHandlerImpl();
    }

    return this.spotifyResponseHandler;
  }
}
