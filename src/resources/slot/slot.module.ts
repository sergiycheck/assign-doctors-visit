import { ResponseMapperModule } from './../common/responseMapper/response-mapper.module';
import { UserDoctorCommonModule } from './../common/user-doctor-common/user-doctor-common.module';
import { forwardRef, Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotsSchema } from './entities/slot.entity';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';

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
  ],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService],
})
export class SlotModule {}
