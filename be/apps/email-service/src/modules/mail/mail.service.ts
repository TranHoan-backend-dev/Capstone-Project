import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { AccountCreationContext, MailInformation, PasswordResetContext } from "../../infrastructure/model/mail.entity";

@Injectable()
export class MailServiceImpl {
  private readonly logger = new Logger(MailServiceImpl.name)
  constructor(
    private readonly mailerService: MailerService,
  ) {
  }

  public sendNormalEmail(
    info: MailInformation,
    context: AccountCreationContext | PasswordResetContext
  ): any {
    // console.log(info)
    // console.log(context)
    this.logger.log('MailService is serving request')
    console.log(process.cwd())
    return this
      .mailerService
      .sendMail({
        to: info.to,
        subject: info.subject,
        template: info.template,
        context: context,
      })
      .then((success) => {
        this.logger.log(success)
        return true;
      })
      .catch((error) => {
        this.logger.error(error)
        return false;
      });
  }

  // public example3(): void {
  //   this
  //     .mailerService
  //     .sendMail({
  //       to: 'test@nestjs.com',
  //       from: 'noreply@nestjs.com',
  //       subject: 'Testing Nest Mailermodule with template ✔',
  //       template: __dirname + '/index', // The `.pug` or `.hbs` extension is appended automatically.
  //       context: {  // Data to be sent to template engine.
  //         code: 'cf1a3f828287',
  //         username: 'john doe',
  //       },
  //     })
  //     .then((success) => {
  //       console.log(success)
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //     });
  // }
}
