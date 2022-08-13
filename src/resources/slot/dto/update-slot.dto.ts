import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateSlotForDoctorDto } from './create-slot.dto';

export class UpdateSlotDto extends PartialType(CreateSlotForDoctorDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
