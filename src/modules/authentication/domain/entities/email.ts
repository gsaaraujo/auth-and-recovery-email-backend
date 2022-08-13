import { InvalidEmailError } from '../errors/invalid-email';
import { ApiError } from '../../../../app/helpers/api-error';
import { HttpStatusCode } from '../../../../app/helpers/http';
import { Either, left, right } from '../../../../app/helpers/either';

export class EmailEntity {
  private constructor(public readonly email: string) {}

  public static create(email: string): Either<InvalidEmailError, EmailEntity> {
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

    const emailEntity = new EmailEntity(email);
    return right(emailEntity);
  }
}
