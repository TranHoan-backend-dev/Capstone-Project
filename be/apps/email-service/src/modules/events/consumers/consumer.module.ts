import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';
import { MailModule } from '../../api/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ConsumerController],
})
export class ConsumerModule { }
