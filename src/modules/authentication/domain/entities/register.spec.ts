import { HttpStatusCode } from '../../../../app/helpers/http';
import { InvalidEmailError } from '../errors/invalid-email';
import { InvalidPasswordError } from '../errors/invalid-password';
import { RegisterEntity } from './register';

describe('RegisterEntity', () => {
  it('should create Register if email and password are valid.', () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = 'Success@@2022';

    const registerEntity: RegisterEntity = {
      email: 'gabriel.houth@gmail.com',
      password: 'Success@@2022',
    };

    const register = RegisterEntity.create(fakeEmail, fakePassword);

    expect(register.isRight()).toBeTruthy();
    expect(register.value).toEqual(registerEntity);
  });

  it('should return InvalidEmailError if email is not valid.', () => {
    const fakeEmail = 'gabr.iel.hou.th@gm@il.com';
    const fakePassword = 'Success@@2022';

    const register = RegisterEntity.create(fakeEmail, fakePassword);

    expect(register.isLeft()).toBeTruthy();
    expect(register.value).toEqual(
      new InvalidEmailError(
        HttpStatusCode.BAD_REQUEST,
        'The email must be a valid email.',
      ),
    );
  });

  it('should return InvalidPasswordError if password is not valid.', () => {
    const fakeEmail = 'gabriel.houth@gmail.com';
    const fakePassword = '123';

    const register = RegisterEntity.create(fakeEmail, fakePassword);

    expect(register.isLeft()).toBeTruthy();
    expect(register.value).toEqual(
      new InvalidPasswordError(
        HttpStatusCode.BAD_REQUEST,
        'The password must be between 8 to 15 characters which contain at' +
          'least one lowercase letter, one uppercase letter, one numeric digit,' +
          'and one special character',
      ),
    );
  });
});
