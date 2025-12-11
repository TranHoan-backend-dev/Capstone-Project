import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { MailModule } from '../../api/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule { }
