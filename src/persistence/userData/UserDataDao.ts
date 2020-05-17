interface UserDataDao {
  createUser: (userData: UserData) => Promise<void>;

  updateUserData: (userData: UserData) => Promise<void>;

  queryByUsername: (username: string) => Promise<UserData>;
}
