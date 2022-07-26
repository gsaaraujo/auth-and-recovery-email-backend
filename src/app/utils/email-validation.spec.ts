import { isEmailValid } from './email-validation';

describe('test email validation', () => {
  it('should return true if email is a valid email.', () => {
    const fakeEmail = 'gabriel.houth@gmail.com';

    expect(isEmailValid(fakeEmail)).toBeTruthy();
  });

  it('should return false if email is not a valid email.', () => {
    const fakeEmail = 'gabr1el.h@uth@@gmail.com';

    expect(isEmailValid(fakeEmail)).toBeFalsy();
  });
});
