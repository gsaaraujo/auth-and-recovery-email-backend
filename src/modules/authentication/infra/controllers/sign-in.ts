import validator from 'validator';
import isEmail from 'validator/lib/isEmail';

import { Request, response, Response } from 'express';
import { ISignInUsecase } from '../../data/usecases/sign-in/sign-in';

export default class SignInController {
  constructor(private readonly signInUsecase: ISignInUsecase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;

      const isEmailInvalid = !validator.isEmail(email);
      const isEmailOrPassorwdEmpties = !!!email || !!!password;

      if (isEmailOrPassorwdEmpties) {
        return response.status(400).json({
          error: `${!!email ? 'Password' : 'Email'} must not be empty.`,
        });
      }

      if (isEmailInvalid) {
        return response.status(400).json({
          error: 'Email must be valid.',
        });
      }

      return response.status(200).json({
        success: 'All good !',
      });
    } catch (error) {
      return response.sendStatus(500);
    }
  }
}
