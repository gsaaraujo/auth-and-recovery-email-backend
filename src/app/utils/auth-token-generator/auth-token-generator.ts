export interface IAuthTokenGenerator {
  generate(
    userId: string,
    secretKey: string,
    expiration: number,
  ): Promise<string>;
  validate(token: string, secretKey: string): Promise<boolean>;
  getPayload(token: string): Promise<string>;
}
