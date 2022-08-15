import { SlotRes } from './../../slot/dto/responses.dto';
import { SlotsDocument } from './../../slot/entities/slot.entity';
import { DoctorRes } from './../../doctor/dto/responses.dto';
import { DoctorDocument } from './../../doctor/entities/doctor.entity';
import { UserRes } from './../../user/dto/responses.dto';
import { UserDocument } from './../../user/entities/user.entity';
import {
  createResponseMapper,
  ResponseMapperInjectedNames,
} from './responseMapperCreator';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: ResponseMapperInjectedNames.UserResponseMapper,
      useClass: createResponseMapper<UserDocument, UserRes>(),
    },
    {
      provide: ResponseMapperInjectedNames.DoctorResponseMapper,
      useClass: createResponseMapper<DoctorDocument, DoctorRes>(),
    },
    {
      provide: ResponseMapperInjectedNames.SlotResponseMapper,
      useClass: createResponseMapper<SlotsDocument, SlotRes>(),
    },
  ],
  exports: [
    ResponseMapperInjectedNames.UserResponseMapper,
    ResponseMapperInjectedNames.DoctorResponseMapper,
    ResponseMapperInjectedNames.SlotResponseMapper,
  ],
})
export class ResponseMapperModule {}
