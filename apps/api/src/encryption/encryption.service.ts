import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * EncryptionService provides methods to encrypt and decrypt arbitrary JSON-serializable
 * data using AES-256-GCM. A random IV is generated for each encryption operation.
 * The master key must be provided via the MASTER_KEY environment variable as a hex string.
 */
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor() {
    const master = process.env.MASTER_KEY;
    if (!master) {
      throw new Error(
        'MASTER_KEY environment variable is required for encryption',
      );
    }
    // Interpret the key as a hex string. Users should generate a 32 byte (64 hex characters) key.
    this.key = Buffer.from(master, 'hex');
  }

  /**
   * Encrypts arbitrary data and returns an object containing the IV, ciphertext and auth tag.
   *
   * @param data Data to encrypt. Must be JSON-serializable.
   */
  encrypt(data: unknown): { iv: string; content: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const json = JSON.stringify(data);
    const encrypted = Buffer.concat([
      cipher.update(Buffer.from(json, 'utf8')),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  /**
   * Decrypts an encrypted payload produced by the encrypt() method.
   *
   * @param payload An object containing iv, content and tag hex strings.
   */
  decrypt<T>(payload: {
    iv: string;
    content: string;
    tag: string;
  }): T {
    const iv = Buffer.from(payload.iv, 'hex');
    const content = Buffer.from(payload.content, 'hex');
    const tag = Buffer.from(payload.tag, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([
      decipher.update(content),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString('utf8'));
  }
}
