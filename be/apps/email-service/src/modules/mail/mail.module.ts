require('dotenv').config();
import {Module} from "@nestjs/common";
import {MailerModule} from "@nestjs-modules/mailer"
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {MailService} from "./mail.service";
import {MailController} from "./mail.controller";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: '"nest-modules" <hoana5k44nknd@gmail.com>'
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }
    })
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {
}
