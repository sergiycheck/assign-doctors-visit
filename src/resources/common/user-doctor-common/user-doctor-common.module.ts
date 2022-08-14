import { SlotModule } from './../../slot/slot.module';
import { DoctorModule } from './../../doctor/doctor.module';
import { UserModule } from './../../user/user.module';
import { Doctor, DoctorDocument } from './../../doctor/entities/doctor.entity';
import { User, UserDocument } from './../../user/entities/user.entity';
import { Module, forwardRef } from '@nestjs/common';
import {
  createUserDoctorCommonServiceClass,
  UserDoctorCommonInjectedNames,
} from './user-doctor-common.service-creator';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => DoctorModule),
    forwardRef(() => SlotModule),
  ],
  providers: [
    {
      provide: UserDoctorCommonInjectedNames.UserCommonService,
      useClass: createUserDoctorCommonServiceClass<UserDocument>(User.name),
    },
    {
      provide: UserDoctorCommonInjectedNames.DoctorCommonService,
      useClass: createUserDoctorCommonServiceClass<DoctorDocument>(Doctor.name),
    },
  ],
  exports: [
    UserDoctorCommonInjectedNames.UserCommonService,
    UserDoctorCommonInjectedNames.DoctorCommonService,
  ],
})
export class UserDoctorCommonModule {}
