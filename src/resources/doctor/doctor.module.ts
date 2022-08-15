import { ResponseMapperModule } from './../common/responseMapper/response-mapper.module';
import { UserDoctorCommonModule } from './../common/user-doctor-common/user-doctor-common.module';
import { SlotModule } from './../slot/slot.module';
import { forwardRef, Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Doctor, DoctorsSchema } from './entities/doctor.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Doctor.name,
        useFactory: () => {
          const schema = DoctorsSchema;
          return schema;
        },
      },
    ]),
    forwardRef(() => SlotModule),
    forwardRef(() => UserDoctorCommonModule),
    ResponseMapperModule,
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService, MongooseModule],
})
export class DoctorModule {}
