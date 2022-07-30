export class UserSignedEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
