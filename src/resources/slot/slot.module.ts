import { CustomLoggerModule } from './../../common/logger/custom-logger.module';
import { MessagingQueueConsumer } from './messaging-queue-consumer.service';
import { ResponseMapperModule } from './../common/responseMapper/response-mapper.module';
import { UserDoctorCommonModule } from './../common/user-doctor-common/user-doctor-common.module';
import { forwardRef, Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotsSchema } from './entities/slot.entity';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';
import { BullModule } from '@nestjs/bull';
import {
  SlotsQueuesNames,
  MessagingQueueAssigningSlotsService,
} from './messagin-queue.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Slot.name,
        useFactory: () => {
          const schema = SlotsSchema;
          return schema;
        },
      },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => DoctorModule),
    forwardRef(() => UserDoctorCommonModule),
    ResponseMapperModule,

    CustomLoggerModule,
    BullModule.registerQueue({
      name: SlotsQueuesNames.assign_doctors_visit_queue,
    }),
  ],
  controllers: [SlotController],
  providers: [SlotService, MessagingQueueAssigningSlotsService, MessagingQueueConsumer],
  exports: [SlotService],
})
export class SlotModule {}
