import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailServiceImpl } from '../../api/mail.service';
import { SendMailDto } from '../../../common/dtos/request/send-mail.dto';
import { AccountCreationContext, MailInformation } from '../../../infrastructure/model/mail.entity';

@Controller()
export class ConsumerController {
  constructor(private readonly service: MailServiceImpl) { }

  @EventPattern('user-created')
  sendAccountCreationMail(@Payload() data: any) {
    Logger.log(data);
    Logger.log('Send account creation mail request received');

    if (!data.username || !data.password) {
      Logger.log('Username or password must not be null');
      return;
    }

    const info: MailInformation = {
      to: data.to,
      subject: data.subject,
      template: data.template || 'account-creation',
    }

    const context: AccountCreationContext = {
      name: data.name,
      username: data.username,
      password: data.password,
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    // await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');;
  }
}
