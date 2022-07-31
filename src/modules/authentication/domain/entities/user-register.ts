import { v4 as uuidv4 } from 'uuid';

import { InvalidNameError } from '../errors/invalid-name';
import { InvalidEmailError } from '../errors/invalid-email';
import { BaseError } from '../../../../common/errors/base-error';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';

export class UserRegisterEntity {
  public readonly id: string;

  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    this.id = uuidv4();
  }

  public static create(
    name: string,
    email: string,
    password: string,
  ): Either<BaseError, UserRegisterEntity> {
    const validate: BaseError | void = this.validate(name, email, password);

    if (!!validate) return left(validate);
    return right(new UserRegisterEntity(name, email, password));
  }

  private static validate(
    name: string,
    email: string,
    password: string,
  ): BaseError | void {
    if (name.length > 50) {
      return new InvalidNameError(
        'The name is too long. It must be less than 50 characters.',
      );
    }

    if (email.length > 50) {
      return new InvalidEmailError(
        'The email is too long. It must be less than 50 characters.',
      );
    }

    if (password.length > 12) {
      return new InvalidPasswordError(
        'The password is too long. It must be between 4-12 characters',
      );
    }

    if (password.length < 4) {
      return new InvalidPasswordError(
        'The password is too short. It must be between 4-12 characters',
      );
    }

    if (!isEmailValid(email)) {
      return new InvalidEmailError('The email must be a valid email.');
    }
  }
}
