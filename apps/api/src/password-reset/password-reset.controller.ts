import { Controller, Post, Body } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';

/**
 * Controller for password reset requests.
 */
@Controller('auth')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  /**
   * Request a password reset token. Returns the token in the response.
   * In a real application you would email this token to the user.
   */
  @Post('request-password-reset')
  async requestReset(@Body('email') email: string) {
    const token = await this.passwordResetService.requestReset(email);
    return { resetToken: token };
  }

  /**
   * Reset the password using a token and new password.
   */
  @Post('reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ) {
    const { token, newPassword } = body;
    return this.passwordResetService.resetPassword(token, newPassword);
  }
}