import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityService } from '../common/base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRes } from './dto/responses.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService extends EntityService<
  UserDocument,
  CreateUserDto,
  UpdateUserDto,
  User,
  UserRes
> {
  constructor(@InjectModel(User.name) public model: Model<UserDocument>) {
    super(model);
  }
}
