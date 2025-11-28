import {Body, Controller, Post } from "@nestjs/common";
import {MailService} from "./mail.service";
import {SendMailDto} from "../../common/dtos/request/sendmail.request";

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {
  }

  @Post()
  sendMail(@Body() sendMailDto: SendMailDto): any {
    return this.mailService.sendNormalEmail(
      sendMailDto.to, sendMailDto.subject,
      sendMailDto.body
    );
  }
}
