import { IsPropObjectId } from './../../common/dtos-validations-constraints';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString, Length, Validate } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Validate(IsPropObjectId)
  id: string;
}
