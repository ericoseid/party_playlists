export interface UserData {
  username: string;
  userEmail: string;
  spotifyId?: string;
  authToken?: string;
  refreshToken?: string;
  creationDate?: Date;
  [index: string]: any;
}

export function isUserData(object: any): object is UserData {
  return "username" in object && "userEmail" in object;
}
