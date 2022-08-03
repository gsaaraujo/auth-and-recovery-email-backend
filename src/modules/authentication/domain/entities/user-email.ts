import { InvalidEmailError } from '../errors/invalid-email';
import { BaseError } from '../../../../common/errors/base-error';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';

export class UserEmailEntity {
  private constructor(public readonly email: string) {}

  public static create(email: string): Either<BaseError, UserEmailEntity> {
    const validate: BaseError | void = this.validate(email);

    if (!!validate) return left(validate);
    return right(new UserEmailEntity(email));
  }

  private static validate(email: string): BaseError | void {
    if (email.length > 50) {
      return new InvalidEmailError(
        'The email is too long. It must be less than 50 characters.',
      );
    }

    if (!isEmailValid(email)) {
      return new InvalidEmailError('The email must be a valid email.');
    }
  }
}
