import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailServiceImpl } from '../../../service/mail.service';
import {
  AccountCreationContext,
  DeleteAccount,
  MailInformation,
  OtpContext,
  UpdateAccount
} from '../../../infrastructure/model/mail.entity';

@Controller()
export class ConsumerController {
  constructor(private readonly service: MailServiceImpl) { }

  @EventPattern('user-created')
  async sendAccountCreationEvent(@Payload() data: any) {
    Logger.log('Send account creation mail request received');
    Logger.log(data);

    if (!data.username || !data.password) {
      Logger.log('Username or password must not be null');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: AccountCreationContext = {
      name: data.name,
      username: data.username,
      password: data.password,
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');
  }

  @EventPattern('delete-account')
  async deletingAccountEvent(@Payload() data: any) {
    Logger.log('Deleting event request received');
    Logger.log(data);

    if (!data.fullName || !data.departmentName || !data.email) {
      Logger.log('Fields cannot be missing');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: DeleteAccount = {
      fullName: data.fullName,
      departmentName: data.departmentName,
      email: data.email
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');
  }

  @EventPattern('update-account')
  async updatingAccountEvent(@Payload() data: any) {
    Logger.log('Updating event request received');
    Logger.log(data);

    if (!data.fullName || !data.departmentName) {
      Logger.log('Fields cannot be missing');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: UpdateAccount = {
      fullName: data.fullName,
      departmentName: data.departmentName,
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');
  }

  @EventPattern('verify-otp')
  async sendOtpEvent(@Payload() data: any) {
    Logger.log('Otp event request received');
    Logger.log(data);

    if (!data.name || !data.otp) {
      Logger.log('Fields cannot be missing');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: OtpContext = {
      name: data.name,
      otp: data.otp,
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');
  }

  createMailTemplate (data: any): MailInformation  {
    return {
      to: data.to,
      subject: data.subject,
      template: data.template,
    }
  }
}
