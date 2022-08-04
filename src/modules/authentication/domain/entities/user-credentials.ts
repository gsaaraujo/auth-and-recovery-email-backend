import { InvalidEmailError } from '../errors/invalid-email';
import { ApiError } from '../../../../common/errors/api-error';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';
import { StatusCode } from '../../../../app/helpers/http';

export class UserCredentialsEntity {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  public static create(
    email: string,
    password: string,
  ): Either<ApiError, UserCredentialsEntity> {
    const validate: ApiError | void = this.validate(email, password);

    if (!!validate) return left(validate);
    return right(new UserCredentialsEntity(email, password));
  }

  private static validate(email: string, password: string): ApiError | void {
    if (!isEmailValid(email)) {
      const invalidEmailError = new InvalidEmailError(
        StatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      );
      return invalidEmailError;
    }
  }
}
