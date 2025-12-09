import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { MailServiceImpl } from "./mail.service";
import { SendMailDto } from "../../common/dtos/request/send-mail.dto";
import { AccountCreationContext, MailInformation, PasswordResetContext } from "../../infrastructure/model/mail.entity";
import { WrapperApiDto } from "../../common/dtos/response/wrapper-api.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailServiceImpl,
  ) {
  }

  @Post('create-account')
  //#region openapi description
  @ApiOperation({
    summary: 'Send mail',
    description: 'Send an email using the configured template and context.',
  })
  @ApiBody({
    type: SendMailDto,
    description: 'Information required to send an email',
  })
  @ApiResponse({
    status: 200,
    description: 'Email has been queued/sent successfully.',
    type: WrapperApiDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input. Username or password missing.',
    type: WrapperApiDto,
  })
  //#endregion
  async sendAccountCreationMail(@Body() sendMailDto: SendMailDto): Promise<any> {
    Logger.log('Send account creation mail request received');
    const response = this.buildDefaultResponse()

    if (!sendMailDto.username || !sendMailDto.password) {
      Logger.log('Username or password must not be null');
      response.message = 'Username or password must not be null';
      response.status = HttpStatus.BAD_REQUEST;
      return response;
    }

    const info: MailInformation = {
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      template: sendMailDto.template ?? 'account-creation',
    }

    const context: AccountCreationContext = {
      name: sendMailDto.name,
      username: sendMailDto.username,
      password: sendMailDto.password,
    }

    const status: boolean = await this.mailService.sendNormalEmail(info, context);

    if (!status) {
      response.message = 'Failed to send email';
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return response;
    }
    Logger.log('Email sent successfully');
    return response;
  }

  @Post('reset-password')
  async sendPasswordResetMail(@Body() sendMailDto: SendMailDto): Promise<any> {
    Logger.log('Send password reset mail request received');
    const response = this.buildDefaultResponse()

    if (!sendMailDto.otp) {
      Logger.log('Otp must not be null');
      response.message = 'Otp must not be null';
      response.status = HttpStatus.BAD_REQUEST;
      return response;
    }

    const info: MailInformation = {
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      template: sendMailDto.template ?? 'password-reset',
    }

    const context: PasswordResetContext = {
      name: sendMailDto.name,
      otp: sendMailDto.otp,
    }

    const status: boolean = await this.mailService.sendNormalEmail(info, context);

    if (!status) {
      response.message = 'Failed to send email';
      response.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return response;
    }
    Logger.log('Email sent successfully');
    return response;
  }

  buildDefaultResponse(): WrapperApiDto {
    return {
      status: 200,
      message: 'Success',
      timestamp: new Date(),
    }
  }
}
