import nodemailer from 'nodemailer';

import { Either, left, right } from '../../../../app/helpers/either';
import { BaseError } from '../../../../common/errors/base-error';
import { EmailServiceError } from '../../data/errors/email-service';
import { EmailOptions, IEmailService } from '../../data/ports/email-service';

export class NodemailerEmailService implements IEmailService {
  async send(options: EmailOptions): Promise<Either<BaseError, EmailOptions>> {
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

      const info = await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return right(options);
    } catch (error) {
      return left(new EmailServiceError('Service error'));
    }
  }
}
