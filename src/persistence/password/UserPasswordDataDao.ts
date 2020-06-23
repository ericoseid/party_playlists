import { UserData } from "../../data/UserData";

export interface UserPasswordDataDao {
  createUserPassword: (userData: UserData, password: string) => Promise<void>;

  getUserPassword: (username: string) => Promise<UserPasswordData>;
}
