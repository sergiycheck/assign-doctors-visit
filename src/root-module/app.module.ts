import { CustomLoggerModule } from './../common/logger/custom-logger.module';
import { CustomConnectionService } from './../common/mongoose-connection.service';
import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../resources/user/user.module';
import { DoctorModule } from '../resources/doctor/doctor.module';
import { SlotModule } from '../resources/slot/slot.module';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONDB_DB_CONN_STR: Joi.string().required(),
      }),
    }),
    // ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONDB_DB_CONN_STR');
        return { uri };
      },
      inject: [ConfigService],
    }),
    UserModule,
    DoctorModule,
    SlotModule,
    CustomLoggerModule,
  ],
  controllers: [AppController],
  providers: [
    AllExceptionsFilter,
    AppService,
    { provide: APP_FILTER, useExisting: AllExceptionsFilter },
    CustomConnectionService,
  ],
})
export class AppModule {}
