import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityService } from '../common/base.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slot, SlotsDocument } from './entities/slot.entity';

@Injectable()
export class SlotService extends EntityService<
  SlotsDocument,
  CreateSlotDto,
  UpdateSlotDto,
  Slot
> {
  constructor(@InjectModel(Slot.name) public model: Model<SlotsDocument>) {
    super(model);
  }
}
