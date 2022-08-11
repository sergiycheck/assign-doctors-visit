import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSlotDto } from './create-slot.dto';

export class UpdateSlotDto extends PartialType(CreateSlotDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
