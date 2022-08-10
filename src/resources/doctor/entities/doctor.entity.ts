import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../../resources/user/entities/user.entity';
import { Slot } from '../../../resources/slot/entities/slot.entity';

@Schema({ timestamps: true, versionKey: false })
export class Doctor extends User {
  @Prop({ required: true, maxlength: 100 })
  spec: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Slot.name }] })
  slots: Slot[];
}

export type DoctorDocument = Doctor & Document;

export const DoctorsSchema = SchemaFactory.createForClass(Doctor);
