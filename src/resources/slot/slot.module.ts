import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';

@Module({
  controllers: [SlotController],
  providers: [SlotService]
})
export class SlotModule {}
