/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { ValidationPipe } from '@nestjs/common';
// import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap() {
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);

  // const app = await NestFactory.create(AppModule);
  //
  // const config = new DocumentBuilder()
  //   .setTitle('Email Service')
  //   .setDescription('Service for sending emails business')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build();
  //
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );
  //
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);
  //
  // const port = process.env.PORT || 3000;

  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'],
        queue: 'user_registered_queue',
        queueOptions: {
          durable: false
        },
      },
    }
  );

  microserviceApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await microserviceApp.listen();

  // await app.listen(port);
  // Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
