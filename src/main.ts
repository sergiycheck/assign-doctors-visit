import { CustomLogger } from './common/logger/custom-logger.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './root-module/app.module';
import cors from 'cors';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { CustomLoggerModule } from './common/logger/custom-logger.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Assign a doctor visit web api')
    .setDescription('Assign a visit and be notified')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const logger = app.get(CustomLogger);
  mongoose.set('debug', function (collectionName, methodName, ...methodArgs) {
    logger.log({ collectionName, methodName, ...methodArgs });
  });

  const configService = app.get(ConfigService);
  const port = +configService.get('PORT');

  await app.listen(port);
  console.log(`App is running on ${await app.getUrl()}`);
}
bootstrap();
