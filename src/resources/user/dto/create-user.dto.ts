import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @IsEmail()
  email: string;
}
