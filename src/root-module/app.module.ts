import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../resources/user/user.module';
import { DoctorModule } from '../resources/doctor/doctor.module';
import { SlotModule } from '../resources/slot/slot.module';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
      }),
    }),
    ScheduleModule.forRoot(),
    UserModule,
    DoctorModule,
    SlotModule,
  ],
  controllers: [AppController],
  providers: [
    AllExceptionsFilter,
    AppService,
    { provide: APP_FILTER, useExisting: AllExceptionsFilter },
  ],
})
export class AppModule {}
