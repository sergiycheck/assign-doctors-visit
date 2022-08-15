import { EntitiesDocumentNames } from './../../common/base-entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseEntity } from '../../common/base-entities';
import { User } from '../../../resources/user/entities/user.entity';
import { Doctor } from '../../../resources/doctor/entities/doctor.entity';

@Schema({ timestamps: true, versionKey: false })
export class Slot extends BaseEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: EntitiesDocumentNames.User,
    required: false,
  })
  user?: User;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: EntitiesDocumentNames.Doctor,
    required: true,
  })
  doctor: Doctor;
  // slot field, but we will have createdAt and updatedAt fields

  @Prop({ type: mongoose.Schema.Types.Date, required: true })
  slot_date: Date;

  @Prop({ required: true, type: mongoose.Schema.Types.Boolean })
  free: boolean;
}

export type SlotsDocument = Slot & Document;

export const SlotsSchema = SchemaFactory.createForClass(Slot);
