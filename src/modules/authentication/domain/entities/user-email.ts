import { InvalidEmailError } from '../errors/invalid-email';
import { ApiError } from '../../../../common/errors/api-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';
import { StatusCode } from '../../../../app/helpers/http';

export class UserEmailEntity {
  private constructor(public readonly email: string) {}

  public static create(email: string): Either<ApiError, UserEmailEntity> {
    const validate: ApiError | void = this.validate(email);

    if (!!validate) return left(validate);
    return right(new UserEmailEntity(email));
  }

  private static validate(email: string): ApiError | void {
    if (!isEmailValid(email)) {
      const invalidEmailError = new InvalidEmailError(
        StatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      );
      return invalidEmailError;
    }
  }
}
