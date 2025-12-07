require('dotenv').config();
import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer"
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailServiceImpl } from "./mail.service";
import { MailController } from "./mail.controller";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.ORGANIZATION_MAIL_NAME + ' <' + process.env.EMAIL_ID + '>'
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        }
      }
    })
  ],
  controllers: [MailController],
  providers: [MailServiceImpl]
})
export class MailModule {
}
