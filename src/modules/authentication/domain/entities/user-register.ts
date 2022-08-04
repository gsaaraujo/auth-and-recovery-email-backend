import { v4 as uuidv4 } from 'uuid';

import { InvalidEmailError } from '../errors/invalid-email';
import { InvalidPasswordError } from '../errors/invalid-password';
import { Either, left, right } from '../../../../app/helpers/either';
import { isEmailValid } from '../../../../app/utils/email-validation';
import { StatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../common/errors/api-error';

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
  ): Either<ApiError, UserRegisterEntity> {
    const validate: ApiError | void = this.validate(name, email, password);

    if (!!validate) return left(validate);
    return right(new UserRegisterEntity(name, email, password));
  }

  private static validate(
    name: string,
    email: string,
    password: string,
  ): ApiError | void {
    if (password.length > 12) {
      const invalidPasswordError = new InvalidPasswordError(
        StatusCode.BAD_REQUEST,
        'The password is too long. It must be between 4-12 characters',
      );
      return invalidPasswordError;
    }

    if (password.length < 4) {
      const invalidPasswordError = new InvalidPasswordError(
        StatusCode.BAD_REQUEST,
        'The password is too short. It must be between 4-12 characters',
      );
      return invalidPasswordError;
    }

    if (!isEmailValid(email)) {
      const invalidEmailError = new InvalidEmailError(
        StatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      );
      return invalidEmailError;
    }
  }
}
