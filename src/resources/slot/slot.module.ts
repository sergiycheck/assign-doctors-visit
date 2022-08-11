import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Slot, SlotsSchema } from './entities/slot.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Slot.name,
        useFactory: () => {
          const schema = SlotsSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [SlotController],
  providers: [SlotService],
})
export class SlotModule {}
