import argon2 from 'argon2';
import { ArgoEncrypter } from './argo-encrypter';

describe('ArgoEncrypter -> compare()', () => {
  const fakeText = 'any_text';
  const fakeEncryptedText = 'any_encrypted_text';
  const fakeArgoEncrypter = new ArgoEncrypter();

  it('should return true if argon2 return true', async () => {
    jest.spyOn(argon2, 'verify').mockReturnValue(Promise.resolve(true));

    const isMatch = await fakeArgoEncrypter.compare(
      fakeEncryptedText,
      fakeText,
    );

    expect(isMatch).toBeTruthy();
    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith(fakeEncryptedText, fakeText);
  });

  it('should return false if argon2 return false', async () => {
    jest.spyOn(argon2, 'verify').mockReturnValue(Promise.resolve(false));

    const isMatch = await fakeArgoEncrypter.compare(
      fakeEncryptedText,
      fakeText,
    );

    expect(isMatch).toBeFalsy();
    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith(fakeEncryptedText, fakeText);
  });
});

describe('ArgoEncrypter -> encrypt()', () => {
  const fakeText = 'any_text';
  const fakeEncryptedText = 'any_encrypted_text';
  const fakeArgoEncrypter = new ArgoEncrypter();

  it('should return fakeEncryptedText if argon2 returns fakeEncryptedText', async () => {
    jest
      .spyOn(argon2, 'hash')
      .mockReturnValue(Promise.resolve(fakeEncryptedText));

    const encrypted = await fakeArgoEncrypter.encrypt(fakeText);

    expect(encrypted).toBe(fakeEncryptedText);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledWith(fakeText);
  });
});
