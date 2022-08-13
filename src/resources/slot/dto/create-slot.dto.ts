import { IsPropObjectId } from './../../../common/pipes/custom-parse-objectid.pipe';
import { OmitType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';

export class CreateSlotForDoctorDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  doctor_id: string;

  @IsNotEmpty()
  @IsDateString()
  slot_date: string;

  @IsNotEmpty()
  @IsBoolean()
  free: boolean;
}

export class AssignSlotForUserDto extends PickType(CreateSlotForDoctorDto, [
  'doctor_id',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  slot_id: string;
}

export class CreateEntityDtoForDb extends OmitType(CreateSlotForDoctorDto, [
  'doctor_id',
] as const) {
  @IsString()
  doctor: string;
}
