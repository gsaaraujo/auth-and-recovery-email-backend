export interface ITokenGenerator {
  generate(
    secretKey: string,
    expiration: number,
    payload?: object,
  ): Promise<string>;
}
