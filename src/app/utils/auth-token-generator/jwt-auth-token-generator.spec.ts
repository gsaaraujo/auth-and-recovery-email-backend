import jwt from 'jsonwebtoken';

import { JwtAuthTokenGenerator } from './jwt-auth-token-generator';

describe('JwtAuthTokenGenerator -> getPayload()', () => {
  const fakeToken = 'any_token';
  const fakePayload = { userId: 'any_user_id' };
  const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();

  it('should return fakeToken if jwt returns fakeToken', async () => {
    jest.spyOn(jwt, 'decode').mockReturnValue(fakePayload);

    const payload: string = await jwtAuthTokenGenerator.getPayload(fakeToken);

    expect(payload).toBe(fakePayload.userId);
    expect(jwt.decode).toHaveBeenCalledTimes(1);
    expect(jwt.decode).toHaveBeenCalledWith(fakeToken, { json: true });
  });
});

describe('JwtAuthTokenGenerator -> validate()', () => {
  const fakeToken = 'any_token';
  const fakeSecretKey = 'any_secret_key';
  const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();

  it('should return true if jwt returns true', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => true);

    const isValid: boolean = await jwtAuthTokenGenerator.validate(
      fakeToken,
      fakeSecretKey,
    );

    expect(isValid).toBeTruthy();
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, fakeSecretKey);
  });
});

describe('JwtAuthTokenGenerator -> validate()', () => {
  const fakeToken = 'any_token';
  const fakeSecretKey = 'any_secret_key';
  const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();

  it('should return false if jwt returns false', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => false);

    const isValid: boolean = await jwtAuthTokenGenerator.validate(
      fakeToken,
      fakeSecretKey,
    );

    expect(isValid).toBeFalsy();
    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledWith(fakeToken, fakeSecretKey);
  });
});

describe('JwtAuthTokenGenerator -> generate()', () => {
  const fakeToken = 'any_token';
  const fakeUserId = 'any_user_id';
  const fakeSecretKey = 'any_secret_key';
  const fakeExpiration = 10;
  const jwtAuthTokenGenerator = new JwtAuthTokenGenerator();

  it('should return fakeToken if jwt returns fakeToken', async () => {
    jest.spyOn(jwt, 'sign').mockImplementation(() => fakeToken);

    const tokenGenerated: string = await jwtAuthTokenGenerator.generate(
      fakeUserId,
      fakeSecretKey,
      fakeExpiration,
    );

    expect(tokenGenerated).toBe(fakeToken);
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: fakeUserId },
      fakeSecretKey,
      { expiresIn: fakeExpiration },
    );
  });
});
