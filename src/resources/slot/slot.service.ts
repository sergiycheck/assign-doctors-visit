import { UserRes } from './../user/dto/responses.dto';
import { Inject, Injectable, forwardRef, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Document, LeanDocument, Model } from 'mongoose';

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
import { DoctorDocument } from '../doctor/entities/doctor.entity';
import { UserDocument } from './../user/entities/user.entity';
import {
  UserDoctorCommonServiceT,
  UserDoctorCommonInjectedNames,
} from '../common/user-doctor-common/user-doctor-common.service-creator';

import {
  ResponseMapperInjectedNames,
  ResponseMapperType,
} from './../common/responseMapper/responseMapperCreator';
import { SlotRes, SlotResWithRelations } from './dto/responses.dto';
import { DoctorRes } from '../doctor/dto/responses.dto';

type EntityIdWithServiceType = {
  id: string;
  service: UserService | DoctorService | SlotService;
};
@Injectable()
export class SlotService extends EntityService<
  SlotsDocument,
  CreateEntityDtoForDb,
  UpdateSlotDto
> {
  constructor(
    @InjectModel(Slot.name) public model: Model<SlotsDocument>,
    private userService: UserService,

    @Inject(forwardRef(() => DoctorService)) public doctorService: DoctorService,

    @Inject(ResponseMapperInjectedNames.SlotResponseMapper)
    public responseMapper: ResponseMapperType<SlotsDocument, SlotRes>,

    @Inject(UserDoctorCommonInjectedNames.UserCommonService)
    public userCommonService: UserDoctorCommonServiceT<UserDocument>,
    @Inject(UserDoctorCommonInjectedNames.DoctorCommonService)
    public doctorCommonService: UserDoctorCommonServiceT<DoctorDocument>,
  ) {
    super(model);
  }

  private mapSlotWithRelations(
    slotDoc: Omit<
      Slot &
        mongoose.Document<any, any, any> & {
          _id: mongoose.Types.ObjectId;
        },
      never
    >,
  ) {
    let slotMapped: SlotResWithRelations;

    if (slotDoc.user) {
      const userDoc = slotDoc.user as UserDocument;
      const user = this.userService.responseMapper.mapResponse(userDoc.toObject());
      delete slotDoc.user;

      slotMapped = {
        ...slotMapped,
        user,
      };
    }

    if (slotDoc.doctor) {
      const doctorDoc = slotDoc.doctor as DoctorDocument;
      const doctor = this.doctorService.doctorResponseMapper.mapResponse(
        doctorDoc.toObject(),
      );
      delete slotDoc.doctor;

      slotMapped = {
        ...slotMapped,
        doctor,
      };
    }

    const slot = this.responseMapper.mapResponse(slotDoc.toObject()) as unknown as Omit<
      Slot,
      'user' | 'doctor'
    >;

    slotMapped = {
      ...slot,
      ...slotMapped,
    };

    return slotMapped;
  }

  async finAllMapped() {
    const res = await this.findAll();
    const data = res.arrQuery.map((o) => this.responseMapper.mapResponse(o.toObject()));

    return {
      count: res.count,
      data,
    };
  }

  async findAllWithRelatedEntitiesMapped() {
    const count = await this.model.count();
    const slotDocs = await this.model.find({}).populate(['doctor', 'user']);

    const result = slotDocs.map((slotDoc) => this.mapSlotWithRelations(slotDoc));
    return { count, result };
  }

  async findOneMapped(id: string) {
    const entity = await this.findOne(id);

    return entity ? this.responseMapper.mapResponse(entity) : null;
  }

  async findOneWithRelatedEntitiesMapped(id: string) {
    const slotDoc = await this.model.findById(id).populate(['doctor', 'user']);

    return this.mapSlotWithRelations(slotDoc);
  }

  async updateMapped(id: string, updateDto: UpdateSlotDto) {
    const unsetUser = Boolean(updateDto.user === '');
    if (unsetUser) {
      delete updateDto.user;
      updateDto = {
        ...updateDto,
        $unset: { user: '' },
      };
    }
    const updatedEntity = await this.update(id, updateDto);

    return this.responseMapper.mapResponse(updatedEntity);
  }

  async addJobsIdUpdate(id: string, jobIds: string[]) {
    await this.exists(id);

    const updatedEntity = await this.model.findOneAndUpdate(
      { _id: id },
      {
        $push: { jobIds: { $each: jobIds } },
      },
      { new: true },
    );

    return updatedEntity;
  }

  async removeJobsIdUpdate(id: string, jobIds: string[]) {
    await this.exists(id);

    const updatedEntity = await this.model.findOneAndUpdate(
      { _id: id },
      {
        $pullAll: { jobIds: jobIds },
      },
      { new: true },
    );

    return updatedEntity;
  }

  private async relatedEntitiesExist(entitiesIdWithServices: EntityIdWithServiceType[]) {
    for (const entityWithService of entitiesIdWithServices) {
      await entityWithService.service.exists.call(
        entityWithService.service,
        entityWithService.id,
      );
    }
  }

  private mapEntities<EntityDoc extends Document>(entities: EntityDoc[]) {
    return entities.map((entity) => this.responseMapper.mapResponse(entity.toObject()));
  }

  // adding only free slot for the doctor for further assignment for user
  async createFreeSlotForDoctor(createEntityDto: CreateSlotForDoctorDto) {
    await this.relatedEntitiesExist([
      { id: createEntityDto.doctor, service: this.doctorService },
    ]);

    const createdSlot = await this.create(createEntityDto);

    const updatedDoctor = await this.doctorCommonService.addSlot(
      createEntityDto.doctor,
      createdSlot.id,
    );

    const [slot, doctorMapped] = this.mapEntities([createdSlot, updatedDoctor]);

    return { slot, updatedDoctor: doctorMapped };
  }

  // make slot no free and add slot_id for user's slots arr
  async assignSlotForUser(assignSlotForUserDto: AssignSlotForUserDto) {
    const { doctor: doctor_id, user: user_id, slot_id } = assignSlotForUserDto;

    //TODO: check if user has other assigned slots for that time

    await this.relatedEntitiesExist([
      { id: doctor_id, service: this.doctorService },
      { id: user_id, service: this.userService },
      { id: slot_id, service: this },
    ]);

    const doctorWithSlotsContainingTargetSlot = (await this.doctorService.model.aggregate(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(doctor_id),
          },
        },
        {
          $lookup: {
            from: 'slots',
            localField: 'slots',
            foreignField: '_id',
            as: 'slots',
          },
        },
        {
          $match: {
            slots: {
              $elemMatch: {
                _id: new mongoose.Types.ObjectId(slot_id),
                free: true,
              },
            },
          },
        },
      ],
    )) as LeanDocument<DoctorDocument>[];

    if (!doctorWithSlotsContainingTargetSlot.length) {
      throw new BadRequestException({
        message: `doctor doesn't have such slot or this slot is not free`,
        data: assignSlotForUserDto,
      });
    }
    const [targetDoctor] = doctorWithSlotsContainingTargetSlot;
    const targetDoctorMapped =
      this.doctorService.doctorResponseMapper.mapResponse(targetDoctor);
    delete targetDoctorMapped.slots;
    const doctor = targetDoctorMapped as Omit<DoctorRes, 'slots'>;

    const updateForSlot: UpdateSlotDto = { id: slot_id, free: false, user: user_id };
    const updatedSlot = await this.updateMapped(slot_id, updateForSlot);

    const updatedUserFromDb = await this.userCommonService.addSlot(user_id, slot_id);
    const updatedUser = this.userService.responseMapper.mapResponse(
      updatedUserFromDb.toObject(),
    );

    return { updatedSlot, updatedUser, doctor };
  }

  // make slot free and remove slot_id for user's slots arr
  async discardSlotForUser(assignSlotForUserDto: AssignSlotForUserDto) {
    const { doctor: doctor_id, user: user_id, slot_id } = assignSlotForUserDto;

    await this.relatedEntitiesExist([
      { id: doctor_id, service: this.doctorService },
      { id: user_id, service: this.userService },
      { id: slot_id, service: this },
    ]);

    const doctorWithSlotsContainingTargetSlot = (await this.doctorService.model.aggregate(
      [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(doctor_id),
          },
        },
        {
          $lookup: {
            from: 'slots',
            localField: 'slots',
            foreignField: '_id',
            as: 'slots',
          },
        },
        {
          $match: {
            slots: {
              $elemMatch: {
                _id: new mongoose.Types.ObjectId(slot_id),
                free: false,
                user: new mongoose.Types.ObjectId(user_id),
              },
            },
          },
        },
      ],
    )) as LeanDocument<DoctorDocument>[];

    if (!doctorWithSlotsContainingTargetSlot.length) {
      throw new BadRequestException({
        message: `user with id ${user_id} didn't assign for this slot. Doctor doesn't have such slot or this slot is free or does not have such user`,
        data: assignSlotForUserDto,
      });
    }

    const [targetDoctor] = doctorWithSlotsContainingTargetSlot;
    const targetDoctorMapped =
      this.doctorService.doctorResponseMapper.mapResponse(targetDoctor);
    delete targetDoctorMapped.slots;
    const doctor = targetDoctorMapped as Omit<DoctorRes, 'slots'>;

    const updateForSlot: UpdateSlotDto = {
      id: slot_id,
      free: true,
      user: '',
    };
    const updatedSlot = await this.updateMapped(slot_id, updateForSlot);

    const updatedUserFromDb = await this.userCommonService.removeSlot(user_id, slot_id);
    const updatedUser = this.userService.responseMapper.mapResponse(
      updatedUserFromDb.toObject(),
    );

    return { updatedSlot, updatedUser, doctor };
  }

  //TODO: ? change assigned slot time
  // async updateSlotForUser() {}

  // remove slot and update users and doctors slot properties
  async removeSlotUpdateEntities(id: string) {
    await this.exists(id);
    const slot = await this.findOneMapped(id);

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
      updatedUser = await this.userCommonService.removeSlot(slot.user, slot.id);
    }

    const updatedDoctor = await this.doctorCommonService.removeSlot(slot.doctor, slot.id);

    const entitiesArr = [updatedDoctor];
    if (updatedUser) {
      entitiesArr.push(updatedUser);
    }
    const data = this.mapEntities(entitiesArr);

    return { slotRemovedResult, data };
  }
}
