import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * AuthController provides login and TOTP management endpoints.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint using the local strategy.
   * Returns a JWT access token if credentials (and optional TOTP) are valid.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  /**
   * Generate a new TOTP secret for the authenticated user.
   * Requires a valid JWT.
   */
  @UseGuards(JwtAuthGuard)
  @Post('enable-totp')
  async enableTotp(@Request() req) {
    const secret = await this.authService.generateTotpSecret(req.user.userId);
    return { secret: secret.base32, otpauth_url: secret.otpauth_url };
  }

  /**
   * Verify a provided TOTP code for the authenticated user.
   * Requires a valid JWT and a JSON body `{ token: string }`.
   */
  @UseGuards(JwtAuthGuard)
  @Post('verify-totp')
  async verifyTotp(@Request() req, @Body('token') token: string) {
    await this.authService.verifyTotp(req.user.userId, token);
    return { message: 'TOTP verified' };
  }
}