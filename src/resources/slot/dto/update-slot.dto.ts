import { IsPropObjectId } from './../../common/dtos-validations-constraints';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Validate } from 'class-validator';
import { CreateSlotForDoctorDto } from './create-slot.dto';
import { isEmptyOrObjectId } from '../../../resources/common/dtos-validations-constraints';

export class UpdateSlotDto extends PartialType(CreateSlotForDoctorDto) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  id: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Validate(isEmptyOrObjectId)
  user?: string;

  [key: string]: any;
}
