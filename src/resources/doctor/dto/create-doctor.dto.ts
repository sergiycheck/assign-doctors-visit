import { IsNotEmpty, IsString, Length } from 'class-validator';

import { CreateUserDto } from '../../../resources/user/dto/create-user.dto';

export class CreateDoctorDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  spec: string;
}
