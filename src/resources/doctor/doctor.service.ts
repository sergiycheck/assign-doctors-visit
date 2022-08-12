import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { Injectable } from '@nestjs/common';
import { EntityService } from '../common/base.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorRes } from './dto/responses.dto';

@Injectable()
export class DoctorService extends EntityService<
  DoctorDocument,
  CreateDoctorDto,
  UpdateDoctorDto,
  Doctor,
  DoctorRes
> {
  constructor(@InjectModel(Doctor.name) public model: Model<DoctorDocument>) {
    super(model);
  }
}
