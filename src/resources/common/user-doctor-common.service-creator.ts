import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { Slot } from '../slot/entities/slot.entity';

export const injectedNames = {
  UserCommonService: 'UserCommonService',
  DoctorCommonService: 'DoctorCommonService',
};

export type IUserDoctorCommonService<
  TClassDoc,
  TUpdateClassEntDto extends { id: string },
> = {
  addSlot<
    TSlotContainingEntity extends {
      slots: Slot[];
    } & TUpdateClassEntDto,
  >(
    entity: TSlotContainingEntity,
    slot_id: string,
  ): Promise<
    HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>
  >;

  removeSlot<
    TSlotContainingEntity extends {
      slots: Slot[];
    } & TUpdateClassEntDto,
  >(
    entity: TSlotContainingEntity,
    slot_id: string,
  ): Promise<
    HydratedDocument<TClassDoc, Record<string, unknown>, Record<string, unknown>>
  >;
};

export function createUserDoctorCommonServiceClass<
  TClassDoc,
  TUpdateClassEntDto extends { id: string },
>(modelName: string): any {
  //
  @Injectable()
  class UserDoctorCommonService {
    constructor(@InjectModel(modelName) public model: Model<TClassDoc>) {}

    public async addSlot<
      TSlotContainingEntity extends { slots: Slot[] } & TUpdateClassEntDto,
    >(entity: TSlotContainingEntity, slot_id: string) {
      const updatedEntity = await this.model.findOneAndUpdate(
        { _id: entity.id },
        {
          $push: { slots: slot_id },
        },
        { new: true },
      );

      return updatedEntity;
    }

    public async removeSlot<
      TSlotContainingEntity extends { slots: Slot[] } & TUpdateClassEntDto,
    >(entity: TSlotContainingEntity, slot_id: string) {
      const updatedEntity = await this.model.findOneAndUpdate(
        { _id: entity.id },
        {
          $pull: { slots: slot_id },
        },
        { new: true },
      );

      return updatedEntity;
    }
  }

  return UserDoctorCommonService;
}

// @Injectable()
// export class UserDoctorCommonService<
//   TClassDocument,
//   TUpdateClassEntityDto extends { id: string },
// > {
//   constructor(
//     /**@InjectModel(Model.name) in inherited constructor*/
//     public model: Model<TClassDocument>,
//   ) {}

//   async addSlot<TSlotContainingEntity extends { slots: Slot[] } & TUpdateClassEntityDto>(
//     entity: TSlotContainingEntity,
//     slot: Slot,
//   ) {
//     const updatedEntity = await this.model.findOneAndUpdate(
//       { _id: entity.id },
//       {
//         $push: { slots: slot._id },
//       },
//       { new: true },
//     );

//     return updatedEntity;
//   }
//   async removeSlot<
//     TSlotContainingEntity extends { slots: Slot[] } & TUpdateClassEntityDto,
//   >(entity: TSlotContainingEntity, slot: Slot) {
//     const updatedEntity = await this.model.findOneAndUpdate(
//       { _id: entity.id },
//       {
//         $pull: { slots: slot._id },
//       },
//       { new: true },
//     );

//     return updatedEntity;
//   }
// }
