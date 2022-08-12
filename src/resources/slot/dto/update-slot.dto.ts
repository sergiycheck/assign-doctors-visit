import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { CreateSlotDto } from './create-slot.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
