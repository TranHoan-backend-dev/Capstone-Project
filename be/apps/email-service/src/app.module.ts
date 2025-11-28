import { Module } from '@nestjs/common';
import {MailController} from "./modules/mail/mail.controller";
import {HealthController} from "./modules/health/health.controller";
import {MailService} from "./modules/mail/mail.service";
import {MailModule} from "./modules/mail/mail.module";
import {HealthModule} from "./modules/health/health.module";

@Module({
  imports: [MailModule, HealthModule],
  controllers: [MailController, HealthController],
  providers: [MailService],
})
export class AppModule {}
