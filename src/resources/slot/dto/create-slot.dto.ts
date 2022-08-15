import { IsPropObjectId } from './../../common/dtos-validations-constraints';
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
  doctor: string;

  @IsNotEmpty()
  @IsDateString()
  slot_date: string;

  @IsNotEmpty()
  @IsBoolean()
  free: boolean;
}

export class AssignSlotForUserDto extends PickType(CreateSlotForDoctorDto, [
  'doctor',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  user: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  slot_id: string;
}

export class CreateEntityDtoForDb extends OmitType(CreateSlotForDoctorDto, [
  'doctor',
] as const) {
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  doctor: string;
}
