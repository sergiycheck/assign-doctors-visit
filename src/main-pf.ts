import { NestFactory } from '@nestjs/core';
import populateDb from './populate-db';
import { AppModule } from './root-module/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  await populateDb(app);
}
bootstrap();
