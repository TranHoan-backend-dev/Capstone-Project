import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailServiceImpl } from '../../../service/mail.service';
import {
  AccountCreationContext,
  DeleteAccountContext,
  MailInformation,
  NewDeviceLoginContext,
  OtpContext,
  UpdateAccountContext, UpdatePasswordContext
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

    const context: DeleteAccountContext = {
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

    const context: UpdateAccountContext = {
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

  @EventPattern('update-password')
  async updatePasswordEvent(@Payload() data: any) {
    Logger.log('Update password event request received');
    Logger.log(data);

    if (!data.name || !data.otp) {
      Logger.log('Fields cannot be missing');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: UpdatePasswordContext = {
      fullName: data.fullName,
    }

    Logger.log('Info: ', info);
    Logger.log('Context: ', context);

    await this.service.sendNormalEmail(info, context);

    Logger.log('Email sent successfully');
  }

  @EventPattern('new-device-login')
  async sendNewDeviceLoginEvent(@Payload() data: any) {
    Logger.log('New device login event request received');
    Logger.log(data);

    if (!data.name || !data.deviceName) {
      Logger.log('Fields cannot be missing');
      return;
    }

    const info = this.createMailTemplate(data)

    const context: NewDeviceLoginContext = {
      name: data.name,
      deviceName: data.deviceName,
      loginTime: data.loginTime,
      ipAddress: data.ipAddress,
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
