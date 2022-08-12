import { OmitType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSlotDto {
  @IsOptional()
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

  @IsNotEmpty()
  @IsBoolean()
  free: boolean;
}

export class CreateEntityDtoForDb extends OmitType(CreateSlotDto, [
  'user_id',
  'doctor_id',
] as const) {
  @IsOptional()
  @IsString()
  user?: string;

  @IsString()
  doctor: string;
}
