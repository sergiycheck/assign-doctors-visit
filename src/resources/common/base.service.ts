import { Injectable, NotFoundException } from '@nestjs/common';
import { LeanDocument, Model } from 'mongoose';
import { BaseEntity } from './base-entities';

@Injectable()
export class EntityService<
  TClassDocument,
  TCreateClassEntityDto,
  TUpdateClassEntityDto extends { id: string },
  TClassEntity extends BaseEntity,
> {
  constructor(
    /**@InjectModel(Model.name) in inherited constructor*/
    public model: Model<TClassDocument>,
  ) {}

  async create(createEntityDto: TCreateClassEntityDto) {
    const entity = new this.model({
      ...createEntityDto,
    });
    const newEntity = await entity.save();
    const obj = newEntity.toObject() as LeanDocument<TClassEntity>;
    return this.mapResponse(obj);
  }

  private mapResponse(entity: LeanDocument<TClassEntity>) {
    const { _id, ...data } = entity;

    return {
      id: _id,
      ...data,
    };
  }

  async findAll() {
    const arrQuery = await this.model.find({});
    return arrQuery.map((o) => this.mapResponse(o.toObject()));
  }

  async findOne(id: string) {
    const entity = (await this.model.findById(id).lean()) as LeanDocument<TClassEntity>;
    return this.mapResponse(entity);
  }

  async update(id: string, updateEntityDto: TUpdateClassEntityDto) {
    const exists = await this.model.exists({ _id: id });
    if (!exists) throw new NotFoundException(`entity with id ${id} doesn't exist `);

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
