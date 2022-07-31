import { InvalidEmailError } from '../errors/invalid-email';
import { BaseError } from '../../../../common/errors/base-error';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';

export class UserCredentialsEntity {
  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  public static create(
    email: string,
    password: string,
  ): Either<BaseError, UserCredentialsEntity> {
    const validate: BaseError | void = this.validate(email, password);

    if (!!validate) return left(validate);
    return right(new UserCredentialsEntity(email, password));
  }

  private static validate(email: string, password: string): BaseError | void {
    if (email.length > 50) {
      return new InvalidEmailError(
        'The email is too long. It must be less than 50 characters.',
      );
    }

    if (password.length > 50) {
      return new InvalidPasswordError(
        'The password is too long. It must be less than 50 characters.',
      );
    }

    if (!isEmailValid(email)) {
      return new InvalidEmailError('The email must be a valid email.');
    }
  }
}
