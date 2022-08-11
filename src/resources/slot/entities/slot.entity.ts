import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../common/base-entities';
import { User, UserDocumentName } from '../../../resources/user/entities/user.entity';
import {
  Doctor,
  DoctorDocumentName,
} from '../../../resources/doctor/entities/doctor.entity';

export const SlotDocumentName = 'Slot';

@Schema({ timestamps: true, versionKey: false })
export class Slot extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: UserDocumentName, required: false })
  user?: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: DoctorDocumentName, required: true })
  doctor: Doctor;
  // slot field, but we will have createdAt and updatedAt fields

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  slot_date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.Boolean })
  free: boolean;
}

export type SlotsDocument = Slot & Document;

export const SlotsSchema = SchemaFactory.createForClass(Slot);
