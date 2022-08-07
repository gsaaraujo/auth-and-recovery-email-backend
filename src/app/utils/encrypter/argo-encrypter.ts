import argon2 from 'argon2';
import { IEncrypter } from './encrypter';

export class ArgoEncrypter implements IEncrypter {
  compare(encryptedText: string, plainText: string): Promise<boolean> {
    return argon2.verify(encryptedText, plainText);
  }
  encrypt(plainText: string): Promise<string> {
    return argon2.hash(plainText);
  }
}
