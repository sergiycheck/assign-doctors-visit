import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserDoctorCommonInjectedNames,
  UserDoctorCommonServiceT,
} from './../common/user-doctor-common/user-doctor-common.service-creator';
import { UserRes } from './dto/responses.dto';

import { EntityService } from '../common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

import {
  ResponseMapperInjectedNames,
  ResponseMapperType,
  EntityDocWithSlotsField,
} from './../common/responseMapper/responseMapperCreator';

@Injectable()
export class UserService extends EntityService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name) public model: Model<UserDocument>,

    @Inject(ResponseMapperInjectedNames.UserResponseMapper)
    public responseMapper: ResponseMapperType<UserDocument, UserRes>,

    @Inject(UserDoctorCommonInjectedNames.UserCommonService)
    private userDoctorCommonService: UserDoctorCommonServiceT<UserDocument>,
  ) {
    super(model);
  }

  async createMapped(createDto: CreateUserDto) {
    const res = await this.create(createDto);
    const mappedRes = this.responseMapper.mapResponse(res.toObject());
    return mappedRes;
  }

  async finAllMapped() {
    const res = await this.findAll();
    const data = res.arrQuery.map((o) => this.responseMapper.mapResponse(o.toObject()));

    return {
      count: res.count,
      data,
    };
  }

  async findOneMapped(id: string) {
    const entity = await this.findOne(id);

    return entity ? this.responseMapper.mapResponse(entity) : null;
  }

  async updateMapped(id: string, updateDto: UpdateUserDto) {
    const updatedEntity = await this.update(id, updateDto);

    return this.responseMapper.mapResponse(updatedEntity);
  }

  public async findAllWithSlotsMapped() {
    const { count, arrQuery } = await this.userDoctorCommonService.findAllWithSlots();

    const data = arrQuery.map((entityDocumentPopulated) => {
      return this.responseMapper.mapEntityWithSlot(entityDocumentPopulated);
    });

    return { count, data };
  }

  public async findOneWithSlotsMapped(id: string) {
    const entity = (await this.userDoctorCommonService.findOneWithSlots(
      id,
    )) as unknown as EntityDocWithSlotsField<UserDocument>;

    return this.responseMapper.mapEntityWithSlot(entity);
  }
}
