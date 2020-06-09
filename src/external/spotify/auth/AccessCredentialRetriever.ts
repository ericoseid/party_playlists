interface AccessCredentialRetriever {
  retrieveAccessCredentials: (
    authCode: string
  ) => Promise<AuthenticationResponse>;
}
