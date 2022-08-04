import nodemailer from 'nodemailer';

import { Either, left, right } from '../../../../app/helpers/either';
import { StatusCode } from '../../../../app/helpers/http';
import { ApiError } from '../../../../common/errors/api-error';
import { EmailServiceError } from '../../data/errors/email-service';
import { EmailOptions, IEmailService } from '../../data/ports/email-service';

export class NodemailerEmailService implements IEmailService {
  async send(options: EmailOptions): Promise<Either<ApiError, EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: options.host,
        port: parseInt(options.port),
        secure: false,
        auth: {
          user: options.user,
          pass: options.password,
        },
      });

      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return right(options);
    } catch (error) {
      const emailServiceError = new EmailServiceError(
        StatusCode.BAD_GATEWAY,
        'Service error',
      );
      return left(emailServiceError);
    }
  }
}
