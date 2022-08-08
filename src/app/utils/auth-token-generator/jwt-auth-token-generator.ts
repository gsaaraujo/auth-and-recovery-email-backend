import jwt from 'jsonwebtoken';

import { IAuthTokenGenerator } from './auth-token-generator';

export class JwtAuthTokenGenerator implements IAuthTokenGenerator {
  async getUserId(token: string): Promise<string> {
    return jwt.decode(token) as string;
  }
  async isValid(token: string, secretKey: string): Promise<boolean> {
    return !!jwt.verify(token, secretKey);
  }
  async generate(
    userId: string,
    secretKey: string,
    expiration: number,
  ): Promise<string> {
    return jwt.sign(userId, secretKey, { expiresIn: expiration });
  }
}
