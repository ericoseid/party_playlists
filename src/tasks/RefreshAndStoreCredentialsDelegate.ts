import { UserData } from "../data/UserData";

export interface RefreshAndStoreCredentialsDelegate {
  refreshAndStoreCredentials: (userData: UserData) => Promise<string>;
}
