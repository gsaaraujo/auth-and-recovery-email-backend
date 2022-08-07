import jwt from 'jsonwebtoken';

import { ITokenGenerator } from './token-generator';

export class JwtTokenGenerator implements ITokenGenerator {
  generate(
    secretKey: string,
    expiration: number,
    payload?: object,
  ): Promise<string> {
    const token: string = jwt.sign(payload || {}, secretKey, {
      expiresIn: expiration,
    });

    return Promise.resolve(token);
  }
}
