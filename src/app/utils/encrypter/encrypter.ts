export interface IEncrypter {
  encrypt(plainText: string): Promise<string>;
  compare(encryptedText: string, plainText: string): Promise<boolean>;
}
