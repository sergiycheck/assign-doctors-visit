import { SlotRes } from './../../slot/dto/responses.dto';
import { Slot } from './../../slot/entities/slot.entity';
import { Injectable } from '@nestjs/common';
import { Document, LeanDocument } from 'mongoose';

export const ResponseMapperInjectedNames = {
  UserResponseMapper: 'UserResponseMapper',
  DoctorResponseMapper: 'DoctorResponseMapper',
  SlotResponseMapper: 'SlotResponseMapper',
};

export type EntityDocWithSlotsField<TClassDoc> = {
  slots: Slot[];
  toObject(): LeanDocument<TClassDoc>;
};

export type ResponseMapperType<TClassDoc extends Document, TClassRes> = {
  mapResponse(entity: LeanDocument<TClassDoc>): TClassRes;

  mapEntityWithSlot(entity: EntityDocWithSlotsField<TClassDoc>): TClassRes & {
    slots: SlotRes[];
  };
};

export function createResponseMapper<TClassDoc extends Document, TClassRes>(): any {
  @Injectable()
  class ResponseMapper {
    public mapResponse(entity: LeanDocument<TClassDoc>): TClassRes {
      const { _id, ...data } = entity;

      const mapped = {
        id: _id,
        ...data,
      } as unknown as TClassRes;

      return mapped;
    }

    public mapEntityWithSlot(entity: EntityDocWithSlotsField<TClassDoc>) {
      const slotsMapped = entity.slots.map((slot) => {
        const slotDoc = slot as Slot & { toObject(): any };
        return this.mapResponse(slotDoc.toObject());
      }) as unknown as SlotRes[];

      delete entity.slots;
      const pojoEntity = entity.toObject();
      const mappedEntity = this.mapResponse(pojoEntity);

      return {
        ...mappedEntity,
        slots: slotsMapped,
      };
    }
  }

  return ResponseMapper;
}
