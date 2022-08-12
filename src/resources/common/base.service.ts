import { Injectable, NotFoundException } from '@nestjs/common';
import { LeanDocument, Model } from 'mongoose';
import { BaseEntity } from './base-entities';

@Injectable()
export class EntityService<
  TClassDocument,
  TCreateClassEntityDto,
  TUpdateClassEntityDto extends { id: string },
  TClassEntity extends BaseEntity,
  TClassRes,
> {
  constructor(
    /**@InjectModel(Model.name) in inherited constructor*/
    public model: Model<TClassDocument>,
  ) {}

  async createRaw(createEntityDto: TCreateClassEntityDto) {
    const entity = new this.model({
      ...createEntityDto,
    });
    const newEntity = await entity.save();

    return newEntity;
  }

  async create(createEntityDto: TCreateClassEntityDto) {
    const newEntity = await this.createRaw(createEntityDto);
    const obj = newEntity.toObject() as LeanDocument<TClassEntity>;
    return this.mapResponse(obj);
  }

  public mapResponse(entity: LeanDocument<TClassEntity>): TClassRes {
    const { _id, ...data } = entity;

    const mapped = {
      id: _id,
      ...data,
    } as unknown as TClassRes;

    return mapped;
  }

  async findAll() {
    const count = await this.model.count({});
    const arrQuery = await this.model.find({});
    const data = arrQuery.map((o) => this.mapResponse(o.toObject()));

    return { count, data };
  }

  async findOne(id: string) {
    const entity = (await this.model.findById(id).lean()) as LeanDocument<TClassEntity>;

    return entity ? this.mapResponse(entity) : null;
  }

  async exists(id: string) {
    const exists = await this.model.exists({ _id: id });
    if (!exists) throw new NotFoundException(`entity with id ${id} doesn't exist `);

    return true;
  }

  async update(id: string, updateEntityDto: TUpdateClassEntityDto) {
    await this.exists(id);

    const { id: idDto, ...updateData } = updateEntityDto;
    const updateEntity = (await this.model
      .findOneAndUpdate(
        { _id: idDto },
        { ...updateData },
        { runValidators: true, new: true },
      )
      .lean()) as unknown as LeanDocument<TClassEntity>;

    return this.mapResponse(updateEntity);
  }

  remove(id: string) {
    return this.model.deleteOne({ _id: id });
  }
}
