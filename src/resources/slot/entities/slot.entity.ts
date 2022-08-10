import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseEntity } from '../../common/base-entities';
import { User } from '../../../resources/user/entities/user.entity';
import { Doctor } from '../../../resources/doctor/entities/doctor.entity';

@Schema({ timestamps: true, versionKey: false })
export class Slot extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Doctor.name })
  doctor: Doctor;
  // slot field, but we will have createdAt and updatedAt fields

  @Prop({ type: mongoose.Schema.Types.Date })
  slot_date: Date;
}

export type SlotsDocument = Slot & Document;

export const SlotsSchema = SchemaFactory.createForClass(Slot);
