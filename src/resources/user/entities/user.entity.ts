import { EntitiesDocumentNames } from './../../common/base-entities';
import { BaseEntity } from '../../common/base-entities';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Slot } from '../../../resources/slot/entities/slot.entity';

@Schema({ timestamps: true, versionKey: false })
export class User extends BaseEntity {
  @Prop({ required: true, maxlength: 20 })
  name: string;

  @Prop({ required: true, maxlength: 100 })
  phone: string;

  @Prop({ required: true, maxlength: 100 })
  email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: EntitiesDocumentNames.Slot }],
  })
  slots: Slot[];
}

export type UserDocument = User & Document;

export const UsersSchema = SchemaFactory.createForClass(User);
