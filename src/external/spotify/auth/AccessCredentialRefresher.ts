interface AccessCredentialRefresher {
  refreshAccessCredentials: (
    refreshToken: string
  ) => Promise<AuthenticationResponse>;
}
