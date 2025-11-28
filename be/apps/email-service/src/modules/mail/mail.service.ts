import {Injectable} from "@nestjs/common";
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
  }

  public sendNormalEmail(to: string, subject: string, body?: string): void {
    this
      .mailerService
      .sendMail({
        to: to,
        from: 'me',
        subject: subject,
        text: body ?? 'text',
        html: 'Hello!',
      })
      .then((success) => {
        console.log(success)
      })
      .catch((error) => {
        console.error(error)
      });
  }

  public example2(): void {
    this
      .mailerService
      .sendMail({
        to: 'user@gmail.com', // List of receivers email address
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  public example3(): void {
    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: __dirname + '/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }
}
