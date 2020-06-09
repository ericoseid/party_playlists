interface UserData {
  username: string;
  userEmail?: string;
  spotifyId?: string;
  authToken?: string;
  refreshToken?: string;
  creationDate?: Date;
  [index: string]: any;
}

function isUserData(object: any): object is UserData {
  return "username" in object;
}
