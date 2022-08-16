import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isObjectId } from '../../utils/isObjectId';

@Injectable()
export class CustomParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return isObjectId(value);
  }
}
