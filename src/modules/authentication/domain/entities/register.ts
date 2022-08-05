import { StatusCode } from '../../../../app/helpers/http';
import { InvalidEmailError } from '../errors/invalid-email';
import { ApiError } from '../../../../common/errors/api-error';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';

export class RegisterEntity {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  public static create(
    email: string,
    password: string,
  ): Either<ApiError, RegisterEntity> {
    if (!isEmailValid(email)) {
      const invalidEmailError = new InvalidEmailError(
        StatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      );
      return left(invalidEmailError);
    }

    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    const isMatch = passwordPattern.test(password);

    if (!isMatch) {
      const invalidEmailError = new InvalidPasswordError(
        StatusCode.BAD_REQUEST,
        'The password must be between 8 to 15 characters which contain at' +
          'least one lowercase letter, one uppercase letter, one numeric digit,' +
          'and one special character',
      );
      return left(invalidEmailError);
    }

    const registerEntity = new RegisterEntity(email, password);
    return right(registerEntity);
  }
}
