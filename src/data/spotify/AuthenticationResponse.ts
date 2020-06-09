interface AuthenticationResponse {
  access_token: string | undefined;
  refresh_token: string | undefined;
  error: string | undefined;
  error_description: string | undefined;
}
