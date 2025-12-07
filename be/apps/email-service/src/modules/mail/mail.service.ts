import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { AccountCreationContext, MailInformation, PasswordResetContext } from "../../infrastructure/model/mail.entity";

@Injectable()
export class MailServiceImpl {
  constructor(
    private readonly mailerService: MailerService,
  ) {
  }

  public sendNormalEmail(
    info: MailInformation,
    context: AccountCreationContext | PasswordResetContext
  ): any {
    Logger.log('MailService is serving request')
    return this
      .mailerService
      .sendMail({
        to: info.to,
        subject: info.subject,
        template: info.template,
        context: context,
      })
      .then((success) => {
        Logger.log(success)
        return true;
      })
      .catch((error) => {
        Logger.error(error)
        return false;
      });
  }

}
