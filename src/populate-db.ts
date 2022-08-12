import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './common/logger/custom-logger.service';
import { CustomConnectionService } from './common/mongoose-connection.service';
import { DbInitializer } from './utils/seed-db';

export default async function populateDb(app: INestApplicationContext) {
  const configService = app.get(ConfigService);
  if (configService.get('POPULATE') === 1) {
    const logger = app.get(CustomLogger);
    const connection = app.get(CustomConnectionService).getConnection();
    const dbInitializer = new DbInitializer(connection, logger);
    await dbInitializer.seedManyDocumentsIntoDb();
  }
}
