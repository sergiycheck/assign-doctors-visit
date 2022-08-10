import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class CustomParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const ObjectId = mongoose.Types.ObjectId;
    if (!ObjectId.isValid(value))
      throw new BadRequestException(`value ${value} is not an objectId`);
    return value;
  }
}
