import { IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  doctor_id: string;

  @IsNotEmpty()
  @IsDateString()
  slot_date: string;
}
