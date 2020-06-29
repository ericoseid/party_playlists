import { UserData } from "../../data/UserData";

export interface UserDataDao {
  createUser: (userData: UserData) => Promise<void>;

  updateUserData: (userData: UserData) => Promise<void>;

  queryByUsername: (username: string) => Promise<UserData[]>;

  queryByEmail: (email: string) => Promise<UserData[]>;
}
