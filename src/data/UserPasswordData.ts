interface UserPasswordData {
  username: string;
  password: string;
  [index: string]: string;
}

function isUserPasswordData(object: any): object is UserPasswordData {
  return object["username"] !== undefined && object["password"] !== undefined;
}
