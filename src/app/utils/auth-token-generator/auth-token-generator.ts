export interface IAuthTokenGenerator {
  generate(
    userId: string,
    secretKey: string,
    expiration: number,
  ): Promise<string>;
  isValid(token: string, secretKey: string): Promise<boolean>;
  getUserId(token: string): Promise<string>;
}
