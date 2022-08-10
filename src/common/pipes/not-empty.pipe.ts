import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value) {
      throw new BadRequestException(`Validation failed. ${this.name} can not be empty`);
    }
    return value;
  }
}
