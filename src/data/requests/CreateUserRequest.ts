import { UserData, isUserData } from "../../../src/data/UserData";

interface CreateUserRequest {
  userData: UserData;
  password: string;
  [index: string]: any;
}

export function isCreateUserRequest(object: any): object is CreateUserRequest {
  return (
    "userData" in object &&
    isUserData(object["userData"]) &&
    "password" in object
  );
}
