import { Body, Controller, HttpStatus, Logger, Post } from "@nestjs/common";
import { MailServiceImpl } from "./mail.service";
import { SendMailDto } from "../../common/dtos/request/send-mail.dto";
import { AccountCreationContext, MailInformation } from "../../infrastructure/model/mail.entity";
import { WrapperApiDto } from "../../common/dtos/response/wrapper-api.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('mail')
export class MailController {
  private readonly logger = new Logger(MailController.name)
  constructor(
    private readonly mailService: MailServiceImpl,
  ) {
  }

  @Post()
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
  async sendMail(@Body() sendMailDto: SendMailDto): Promise<any> {
    this.logger.log('Send mail request received');
    const response: WrapperApiDto = {
      status: 200,
      message: 'Success',
      timestamp: new Date(),
    }

    if (!sendMailDto.username || !sendMailDto.password) {
      this.logger.log('Username or password must not be null');
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
    this.logger.log('Email sent successfully');
    return response;
  }
}
