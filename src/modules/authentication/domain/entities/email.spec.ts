import { HttpStatusCode } from '../../../../app/helpers/http';
import { InvalidEmailError } from '../errors/invalid-email';
import { EmailEntity } from './email';

describe('EmailEntity', () => {
  it('should create a email if email is valid.', () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakeEmailEntity: EmailEntity = {
      email: 'gabriel.houth@gmail.com',
    };

    const email = EmailEntity.create(fakeEmail);

    expect(email.isRight()).toBeTruthy();
    expect(email.value).toEqual(fakeEmailEntity);
  });

  it('should return InvalidEmailError if email is not valid.', () => {
    const fakeEmail = 'gabr.iel.hou.th@gm@il.com';

    const email = EmailEntity.create(fakeEmail);

    expect(email.isLeft()).toBeTruthy();
    expect(email.value).toEqual(
      new InvalidEmailError(
        HttpStatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      ),
    );
  });
});
