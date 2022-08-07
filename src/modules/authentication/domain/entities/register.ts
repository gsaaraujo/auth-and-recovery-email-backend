import { InvalidEmailError } from '../errors/invalid-email';
import { ApiError } from '../../../../app/helpers/api-error';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';

export class RegisterEntity {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  public static create(
    email: string,
    password: string,
  ): Either<ApiError, RegisterEntity> {
    const emailPattern =
      /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;
    const isEmailValid = emailPattern.test(email);

    if (!isEmailValid) {
      const invalidEmailError = new InvalidEmailError(
        HttpStatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      );
      return left(invalidEmailError);
    }

    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    const isPasswordValid = passwordPattern.test(password);

    if (!isPasswordValid) {
      const invalidPasswordError = new InvalidPasswordError(
        HttpStatusCode.BAD_REQUEST,
        'The password must be between 8 to 15 characters which contain at' +
          'least one lowercase letter, one uppercase letter, one numeric digit,' +
          'and one special character',
      );
      return left(invalidPasswordError);
    }

    const registerEntity = new RegisterEntity(email, password);
    return right(registerEntity);
  }
}
