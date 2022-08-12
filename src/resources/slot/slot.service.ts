import { UserDocument } from './../user/entities/user.entity';
import {
  IUserDoctorCommonService,
  injectedNames,
} from './../common/user-doctor-common.service-creator';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityService } from '../common/base.service';
import { DoctorService } from '../doctor/doctor.service';
import { UserService } from '../user/user.service';
import { CreateSlotDto, CreateEntityDtoForDb } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { Slot, SlotsDocument } from './entities/slot.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { DoctorDocument } from '../doctor/entities/doctor.entity';
import { UpdateDoctorDto } from '../doctor/dto/update-doctor.dto';
import { SlotRes } from './dto/responses.dto';

type EntityIdWithServiceType = {
  id: string;
  service: UserService | DoctorService | SlotService;
};
@Injectable()
export class SlotService extends EntityService<
  SlotsDocument,
  CreateEntityDtoForDb,
  UpdateSlotDto,
  Slot,
  SlotRes
> {
  constructor(
    @InjectModel(Slot.name) public model: Model<SlotsDocument>,
    private userService: UserService,
    private doctorService: DoctorService,
    @Inject(injectedNames.UserCommonService)
    public userCommonService: IUserDoctorCommonService<UserDocument, UpdateUserDto>,
    @Inject(injectedNames.DoctorCommonService)
    public doctorCommonService: IUserDoctorCommonService<DoctorDocument, UpdateDoctorDto>,
  ) {
    super(model);
  }

  private async relatedEntitiesExist(entitiesIdWithServices: EntityIdWithServiceType[]) {
    for (const entityWithService of entitiesIdWithServices) {
      await entityWithService.service.exists.call(
        entityWithService.service,
        entityWithService.id,
      );
    }
  }

  private mapEntities(entities: { toObject(): any }[]) {
    return entities.map((entity) => this.mapResponse(entity.toObject()));
  }

  async createSlotUpdateEntities(createEntityDto: CreateSlotDto) {
    await this.relatedEntitiesExist([
      { id: createEntityDto.doctor_id, service: this.doctorService },
      { id: createEntityDto.user_id, service: this.userService },
    ]);

    const { user_id, doctor_id, ...slotProps } = createEntityDto;

    const createEntityDtoForDb = {
      user: user_id,
      doctor: doctor_id,
      ...slotProps,
    };

    const createdSlot = (await this.createRaw(createEntityDtoForDb)) as any;

    const user = (await this.userService.findOne(createEntityDto.user_id)) as any;

    const updatedUser = await this.userCommonService.addSlot(user, createdSlot);

    const doctor = (await this.doctorService.findOne(createEntityDto.doctor_id)) as any;

    const updatedDoctor = await this.doctorCommonService.addSlot(doctor, createdSlot);

    const [slot, userMapped, doctorMapped] = this.mapEntities([
      createdSlot,
      updatedUser,
      updatedDoctor,
    ]);

    return { slot, updatedUser: userMapped, updatedDoctor: doctorMapped };
  }

  async removeSlotUpdateEntities(id: string) {
    await this.exists(id);
    const slot = await this.findOne(id);

    const relatedFieldsData = [
      { name: 'user', service: this.userService },
      { name: 'doctor', service: this.doctorService },
    ];

    const relatedEntityIdAndService = Object.entries(slot).reduce((prev, curr) => {
      const [currKey, currVal] = curr;
      const fieldData = relatedFieldsData.find((f) => f.name === currKey);

      if (fieldData && currVal) {
        prev.push({ id: currVal, service: fieldData.service });
      }

      return prev;
    }, []);

    await this.relatedEntitiesExist(relatedEntityIdAndService);

    const slotRemovedResult = await this.remove(slot.id);

    let updatedUser;
    if (slot.user) {
      const user = (await this.userService.findOne(slot.user)) as any;
      updatedUser = await this.userCommonService.removeSlot(user, slot.id);
    }

    const doctor = (await this.doctorService.findOne(slot.doctor)) as any;

    const updatedDoctor = await this.doctorCommonService.removeSlot(doctor, slot.id);

    const entitiesArr = [updatedDoctor];
    if (updatedUser) {
      entitiesArr.push(updatedUser);
    }
    const data = this.mapEntities(entitiesArr);

    return { slotRemovedResult, data };
  }
}
