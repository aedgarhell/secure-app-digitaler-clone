export class CreateSecretDto {
  /**
   * Identifier of the vault to which this secret belongs.
   */
  vaultId: number;
  /**
   * Type or category of the secret (e.g. password, apiKey, sshKey).
   */
  type: string;
  /**
   * Arbitrary JSON object representing the secret fields. This is encrypted
   * before being stored in the database.
   */
  fields: any;
  /**
   * Optional list of tags for categorising the secret.
   */
  tags?: string[];
}
