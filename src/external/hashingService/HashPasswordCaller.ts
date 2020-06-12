interface HashPasswordCaller {
  callHashPassword: (password: string) => Promise<string>;
}
