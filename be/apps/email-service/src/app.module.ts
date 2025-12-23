import { Module } from '@nestjs/common';
import { MailController } from "./modules/api/mail.controller";
import { HealthController } from "./modules/health/health.controller";
import { MailServiceImpl } from "./modules/api/mail.service";
import { MailModule } from "./modules/api/mail.module";
import { HealthModule } from "./modules/health/health.module";
import { ConsumerModule } from './modules/events/consumers/consumer.module';

@Module({
  imports: [MailModule, HealthModule, ConsumerModule],
  controllers: [MailController, HealthController],
  providers: [MailServiceImpl],
})
export class AppModule { }
