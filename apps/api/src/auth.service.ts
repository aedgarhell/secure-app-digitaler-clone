import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate a user's credentials.
   * Returns the user if the credentials are valid or null otherwise.
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    return user;
  }

  /**
   * Generate a signed JWT for the given user.
   */
  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Generate a new TOTP secret for a user.
   * Stores the secret on the user and returns the full secret definition.
   */
  async generateTotpSecret(userId: number) {
    const secret = speakeasy.generateSecret();
    await this.usersService.update(userId, {
      totpSecret: secret.base32,
      totpEnabled: false,
    });
    return secret;
  }

  /**
   * Verify a provided TOTP code for a user.
   * Throws an UnauthorizedException if the code is invalid.
   */
  async verifyTotp(userId: number, token: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.totpSecret) {
      throw new UnauthorizedException('TOTP not set up');
    }
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!verified) {
      throw new UnauthorizedException('Invalid TOTP token');
    }
    // If verification succeeds for the first time, enable TOTP on the user
    if (!user.totpEnabled) {
      await this.usersService.update(user.id, { totpEnabled: true });
    }
    return true;
  }
}