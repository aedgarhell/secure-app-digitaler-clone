export class UpdateSecretDto {
  /**
   * Optional new type/category for the secret.
   */
  type?: string;
  /**
   * Optional new JSON payload to replace the secret fields. If provided,
   * this will be encrypted and stored, and the version will be incremented.
   */
  fields?: any;
  /**
   * Optional list of tags to replace the existing tags.
   */
  tags?: string[];
}