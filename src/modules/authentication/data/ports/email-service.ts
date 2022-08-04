import { Either } from '../../../../app/helpers/either';
import { ApiError } from '../../../../common/errors/api-error';

export type EmailOptions = {
  host: string;
  port: string;
  from: string;
  to: string;
  user: string;
  password: string;
  subject: string;
  html?: string;
};

export interface IEmailService {
  send(options: EmailOptions): Promise<Either<ApiError, EmailOptions>>;
}
