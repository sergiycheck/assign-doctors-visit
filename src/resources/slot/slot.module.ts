import { UpdateDoctorDto } from './../doctor/dto/update-doctor.dto';
import { injectedNames } from './../common/user-doctor-common.service-creator';
import { forwardRef, Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotsSchema } from './entities/slot.entity';
import { UserModule } from '../user/user.module';
import { DoctorModule } from '../doctor/doctor.module';
import { User, UserDocument } from '../user/entities/user.entity';
import { Doctor, DoctorDocument } from '../doctor/entities/doctor.entity';
import { createUserDoctorCommonServiceClass } from '../common/user-doctor-common.service-creator';
import { UpdateUserDto } from '../user/dto/update-user.dto';

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
    UserModule,
    forwardRef(() => DoctorModule),
  ],
  controllers: [SlotController],
  providers: [
    SlotService,
    {
      provide: injectedNames.UserCommonService,
      useClass: createUserDoctorCommonServiceClass<UserDocument, UpdateUserDto>(
        User.name,
      ),
    },
    {
      provide: injectedNames.DoctorCommonService,
      useClass: createUserDoctorCommonServiceClass<DoctorDocument, UpdateDoctorDto>(
        Doctor.name,
      ),
    },
  ],
  exports: [SlotService],
})
export class SlotModule {}
