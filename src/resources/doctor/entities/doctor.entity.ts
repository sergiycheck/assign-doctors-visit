import { BaseEntity } from './../../common/base-entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Slot, SlotDocumentName } from '../../../resources/slot/entities/slot.entity';

export const DoctorDocumentName = 'Doctor';
@Schema({ timestamps: true, versionKey: false })
export class Doctor extends BaseEntity {
  @Prop({ required: true, maxlength: 20 })
  name: string;

  @Prop({ required: true, maxlength: 100 })
  phone: string;

  @Prop({ required: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, maxlength: 100 })
  spec: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: SlotDocumentName }] })
  slots: Slot[];
}

export type DoctorDocument = Doctor & Document;

export const DoctorsSchema = SchemaFactory.createForClass(Doctor);
