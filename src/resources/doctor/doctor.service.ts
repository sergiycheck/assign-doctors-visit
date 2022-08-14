import {
  UserDoctorCommonInjectedNames,
  UserDoctorCommonServiceT,
} from './../common/user-doctor-common/user-doctor-common.service-creator';
import { Doctor, DoctorDocument } from './entities/doctor.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EntityService } from '../common/base.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorRes } from './dto/responses.dto';
import { SlotService } from '../slot/slot.service';
import {
  ResponseMapperInjectedNames,
  ResponseMapperType,
  EntityDocWithSlotsField,
} from './../common/responseMapper/responseMapperCreator';

@Injectable()
export class DoctorService extends EntityService<
  DoctorDocument,
  CreateDoctorDto,
  UpdateDoctorDto
> {
  constructor(
    @InjectModel(Doctor.name) public model: Model<DoctorDocument>,
    @Inject(forwardRef(() => SlotService)) public slotService: SlotService,

    @Inject(ResponseMapperInjectedNames.DoctorResponseMapper)
    public doctorResponseMapper: ResponseMapperType<DoctorDocument, DoctorRes>,

    @Inject(UserDoctorCommonInjectedNames.DoctorCommonService)
    private doctorUserCommonService: UserDoctorCommonServiceT<
      DoctorDocument,
      UpdateDoctorDto
    >,
  ) {
    super(model);
  }

  async createMapped(createDto: CreateDoctorDto) {
    const res = await this.create(createDto);
    const mappedRes = this.doctorResponseMapper.mapResponse(res.toObject());
    return mappedRes;
  }

  async finAllMapped() {
    const res = await this.findAll();
    const data = res.arrQuery.map((o) =>
      this.doctorResponseMapper.mapResponse(o.toObject()),
    );

    return {
      count: res.count,
      data,
    };
  }

  async findOneMapped(id: string) {
    const entity = await this.findOne(id);

    return entity ? this.doctorResponseMapper.mapResponse(entity) : null;
  }

  async updateMapped(id: string, updateDto: UpdateDoctorDto) {
    const updatedEntity = await this.update(id, updateDto);

    return this.doctorResponseMapper.mapResponse(updatedEntity);
  }

  public async findAllWithSlotsMapped() {
    const { count, arrQuery } = await this.doctorUserCommonService.findAllWithSlots();

    const data = arrQuery.map((entityDocumentPopulated) => {
      return this.doctorResponseMapper.mapEntityWithSlot(entityDocumentPopulated);
    });

    return { count, data };
  }

  public async findOneWithSlotsMapped(id: string) {
    const entity = (await this.doctorUserCommonService.findOneWithSlots(
      id,
    )) as unknown as EntityDocWithSlotsField<DoctorDocument>;

    return this.doctorResponseMapper.mapEntityWithSlot(entity);
  }
}
