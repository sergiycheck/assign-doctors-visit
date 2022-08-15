import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateSlotForDoctorDto } from './create-slot.dto';
import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint()
export class isEmptyOrObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    const ObjectId = mongoose.Types.ObjectId;
    if (text.length) {
      if (!ObjectId.isValid(text))
        throw new BadRequestException(`value ${text} is not an objectId`);
      return true;
    } else if (text.length === 0) {
      return true;
    }

    return false;
  }
}
export class UpdateSlotDto extends PartialType(CreateSlotForDoctorDto) {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  @Validate(isEmptyOrObjectId)
  user?: string;

  [key: string]: any;
}
