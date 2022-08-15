import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import mongoose from 'mongoose';

@Injectable()
export class CustomParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return isObjectId(value);
  }
}

@ValidatorConstraint()
export class IsPropObjectId implements ValidatorConstraintInterface {
  validate(text: string) {
    const res = isObjectId(text);
    return res ? true : false;
  }
}

function isObjectId(value: string) {
  const ObjectId = mongoose.Types.ObjectId;
  if (!ObjectId.isValid(value))
    throw new BadRequestException(`value ${value} is not an objectId`);
  return value;
}
