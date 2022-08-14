import { SlotModule } from './../../slot/slot.module';
import { DoctorModule } from './../../doctor/doctor.module';
import { UserModule } from './../../user/user.module';
import { UpdateDoctorDto } from './../../doctor/dto/update-doctor.dto';
import { Doctor, DoctorDocument } from './../../doctor/entities/doctor.entity';
import { UpdateUserDto } from './../../user/dto/update-user.dto';
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
      useClass: createUserDoctorCommonServiceClass<UserDocument, UpdateUserDto>(
        User.name,
      ),
    },
    {
      provide: UserDoctorCommonInjectedNames.DoctorCommonService,
      useClass: createUserDoctorCommonServiceClass<DoctorDocument, UpdateDoctorDto>(
        Doctor.name,
      ),
    },
  ],
  exports: [
    UserDoctorCommonInjectedNames.UserCommonService,
    UserDoctorCommonInjectedNames.DoctorCommonService,
  ],
})
export class UserDoctorCommonModule {}
