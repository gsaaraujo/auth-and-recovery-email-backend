import jwt from 'jsonwebtoken';

import { IAuthTokenGenerator } from './auth-token-generator';

export class JwtAuthTokenGenerator implements IAuthTokenGenerator {
  async getPayload(token: string): Promise<string> {
    const decode = jwt.decode(token, { json: true });
    return decode?.userId ?? '';
  }

  async validate(token: string, secretKey: string): Promise<boolean> {
    return !!jwt.verify(token, secretKey);
  }

  async generate(
    userId: string,
    secretKey: string,
    expiration: number,
  ): Promise<string> {
    return jwt.sign({ userId }, secretKey, { expiresIn: expiration });
  }
}
