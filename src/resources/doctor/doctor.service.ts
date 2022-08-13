import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EntityService } from '../common/base.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument, Document, Types } from 'mongoose';
import { DoctorRes } from './dto/responses.dto';
import { Slot } from '../slot/entities/slot.entity';
import { SlotService } from '../slot/slot.service';

@Injectable()
export class DoctorService extends EntityService<
  DoctorDocument,
  CreateDoctorDto,
  UpdateDoctorDto,
  Doctor,
  DoctorRes
> {
  constructor(
    @InjectModel(Doctor.name) public model: Model<DoctorDocument>,
    @Inject(forwardRef(() => SlotService)) public slotService: SlotService,
  ) {
    super(model);
  }

  async findAllWithSlots() {
    const count = await this.model.count({});

    const arrQuery = await this.model.find().populate({ path: 'slots' });
    const data = arrQuery.map((doctorDocumentPopulated) => {
      return this.mapDoctorWithSlot(doctorDocumentPopulated);
    });

    return { count, data };
  }

  async findOneWithSlots(id: string) {
    const entity = await this.model.findById(id).populate({ path: 'slots' });
    return this.mapDoctorWithSlot(entity);
  }

  private mapDoctorWithSlot(
    entity: Doctor &
      Document<any, any, any> & {
        _id: Types.ObjectId;
      },
  ) {
    const slotsMapped = entity.slots.map((slot) => {
      const slotDoc = slot as Slot & { toObject(): LeanDocument<Slot> };
      return this.slotService.mapResponse(slotDoc.toObject());
    });

    delete entity.slots;

    const mappedDoctor = this.mapResponse(entity.toObject());

    return {
      ...mappedDoctor,
      slots: slotsMapped,
    };
  }
}
