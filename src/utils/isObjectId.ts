import mongoose from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function isObjectId(value: string) {
  const ObjectId = mongoose.Types.ObjectId;
  if (!ObjectId.isValid(value))
    throw new BadRequestException(`value ${value} is not an objectId`);
  return value;
}
