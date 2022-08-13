import { UserDocument } from './../user/entities/user.entity';
import {
  IUserDoctorCommonService,
  injectedNames,
} from './../common/user-doctor-common.service-creator';
import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityService } from '../common/base.service';
import { DoctorService } from '../doctor/doctor.service';
import { UserService } from '../user/user.service';
import {
  CreateSlotForDoctorDto,
  CreateEntityDtoForDb,
  AssignSlotForUserDto,
} from './dto/create-slot.dto';
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

    @Inject(forwardRef(() => DoctorService)) public doctorService: DoctorService,

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

  // adding only free slot for the doctor for further assignment for user
  async createFreeSlotForDoctor(createEntityDto: CreateSlotForDoctorDto) {
    await this.relatedEntitiesExist([
      { id: createEntityDto.doctor_id, service: this.doctorService },
    ]);

    const { doctor_id, ...slotProps } = createEntityDto;

    const createEntityDtoForDb = {
      doctor: doctor_id,
      ...slotProps,
    };

    const createdSlot = (await this.createRaw(createEntityDtoForDb)) as any;

    const doctor = (await this.doctorService.findOne(createEntityDto.doctor_id)) as any;

    const updatedDoctor = await this.doctorCommonService.addSlot(doctor, createdSlot);

    const [slot, doctorMapped] = this.mapEntities([createdSlot, updatedDoctor]);

    return { slot, updatedDoctor: doctorMapped };
  }

  // make slot no free and add slot_id for user's slots arr
  async assignSlotForUser(assignSlotForUserDto: AssignSlotForUserDto) {
    const { doctor_id, user_id, slot_id } = assignSlotForUserDto;

    //TODO: check if user has other assigned slots for that time

    await this.relatedEntitiesExist([
      { id: doctor_id, service: this.doctorService },
      { id: user_id, service: this.userService },
      { id: slot_id, service: this },
    ]);

    // TODO: error
    // The $elemMatch operator matches documents that contain an array field
    // with at least one element that matches all the specified query criteria.
    const doctorWithSlotsContainingTargetSlot = await this.doctorService.model
      .findById(doctor_id)
      .populate({
        path: 'slots',
        match: {
          slots: {
            $elemMatch: {
              _id: slot_id,
              free: true,
            },
          },
        },
      });

    if (!doctorWithSlotsContainingTargetSlot) {
      throw new BadRequestException({
        message: `doctor doesn't have such slot or this slot is not free`,
        data: assignSlotForUserDto,
      });
    }

    const updateForSlot: UpdateSlotDto = { id: slot_id, free: false };
    const updatedSlot = await this.update(slot_id, updateForSlot);

    const user = (await this.userService.findOne(user_id)) as any;

    const updatedUser = await this.userCommonService.addSlot(user, slot_id);

    return { updatedSlot, updatedUser };
  }

  // make slot free and remove slot_id for user's slots arr
  async discardSlotForUser(assignSlotForUserDto: AssignSlotForUserDto) {
    const { doctor_id, user_id, slot_id } = assignSlotForUserDto;

    await this.relatedEntitiesExist([
      { id: doctor_id, service: this.doctorService },
      { id: user_id, service: this.userService },
      { id: slot_id, service: this },
    ]);

    const doctorWithSlotsContainingTargetSlot = await this.doctorService.model
      .findById(doctor_id)
      .populate({
        path: 'slots',
        match: {
          slots: {
            $elemMatch: {
              _id: slot_id,
              free: false,
              user: user_id,
            },
          },
        },
      });

    if (!doctorWithSlotsContainingTargetSlot) {
      throw new BadRequestException({
        message: `doctor doesn't have such slot or this slot is free or does not have such user`,
        data: assignSlotForUserDto,
      });
    }

    const updateForSlot: UpdateSlotDto = { id: slot_id, free: true };
    const updatedSlot = await this.update(slot_id, updateForSlot);

    const user = (await this.userService.findOne(user_id)) as any;

    const updatedUser = await this.userCommonService.removeSlot(user, slot_id);

    return { updatedSlot, updatedUser };
  }

  // change assigned slot time
  // async updateSlotForUser() {}

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
