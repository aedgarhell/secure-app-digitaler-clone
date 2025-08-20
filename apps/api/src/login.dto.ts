export class LoginDto {
  email: string;
  password: string;
  /**
   * Optional TOTP token to be provided during login when TOTP is enabled.
   */
  token?: string;
}