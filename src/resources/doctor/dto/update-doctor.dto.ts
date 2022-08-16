import { IsPropObjectId } from './../../common/dtos-validations-constraints';
import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';
import { CreateDoctorDto } from './create-doctor.dto';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  id: string;
}
