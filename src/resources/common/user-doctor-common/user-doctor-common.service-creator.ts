import { SlotService } from './../../slot/slot.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, UnpackedIntersection } from 'mongoose';

export const UserDoctorCommonInjectedNames = {
  UserCommonService: 'UserCommonService',
  DoctorCommonService: 'DoctorCommonService',
};

export type UserDoctorCommonServiceT<TClassDoc> = {
  addSlot(
    entity_id: string,
    slot_id: string,
  ): Promise<
    HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>
  >;

  removeSlot(
    entity_id: string,
    slot_id: string,
  ): Promise<
    HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>
  >;

  findAllWithSlots(): Promise<{
    count: number;
    arrQuery: Omit<
      HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>,
      never
    >[];
  }>;

  findOneWithSlots(
    id: string,
  ): Promise<
    UnpackedIntersection<
      HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>,
      Record<string, unknown>
    >
  >;
};

export function createUserDoctorCommonServiceClass<TClassDoc>(modelName: string): any {
  //
  @Injectable()
  class UserDoctorCommonService {
    constructor(
      @InjectModel(modelName) public model: Model<TClassDoc>,
      private readonly slotService: SlotService,
    ) {}

    public async addSlot(entity_id: string, slot_id: string) {
      const updatedEntity = await this.model.findOneAndUpdate(
        { _id: entity_id },
        {
          $push: { slots: slot_id },
        },
        { new: true },
      );

      return updatedEntity;
    }

    public async removeSlot(entity_id: string, slot_id: string) {
      const updatedEntity = await this.model.findOneAndUpdate(
        { _id: entity_id },
        {
          $pull: { slots: slot_id },
        },
        { new: true },
      );

      return updatedEntity;
    }

    public async findAllWithSlots() {
      const count = await this.model.count({});
      const arrQuery = await this.model.find().populate({ path: 'slots' });

      return { count, arrQuery };
    }

    public async findOneWithSlots(id: string) {
      const entity = await this.model.findById(id).populate({ path: 'slots' });
      return entity;
    }
  }

  return UserDoctorCommonService;
}
