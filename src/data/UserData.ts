interface UserData {
  username: string;
  userEmail?: string;
  spotifyId?: string;
  authToken?: string;
  refreshToken?: string;
  creationDate?: Date;
  [index: string]: any;
}
