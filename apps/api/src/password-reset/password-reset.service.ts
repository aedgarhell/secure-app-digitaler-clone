import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

/**
 * Simple password reset service that stores reset tokens in memory.
 * In a real application these tokens should be persisted in a database table with an expiration.
 */
@Injectable()
export class PasswordResetService {
  // Map of tokens to user IDs. In production, store in DB with expiry.
  private resetTokens: Map<string, number> = new Map();

  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a password reset token for a user identified by email. Returns the plain token.
   * @param email email of the user requesting a password reset
   */
  async requestReset(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Generate a random token and associate it with the user ID
    const token = randomBytes(32).toString('hex');
    this.resetTokens.set(token, user.id);
    return token;
  }

  /**
   * Reset a user's password using a valid reset token.
   * @param token the password reset token previously generated
   * @param newPassword the new password in plain text
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const userId = this.resetTokens.get(token);
    if (!userId) {
      throw new NotFoundException('Invalid or expired reset token');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: hashed });
    // Remove the token after successful password change
    this.resetTokens.delete(token);
    return { message: 'Password reset successful' };
  }
}