import { ResponseMapperModule } from './../common/responseMapper/response-mapper.module';
import { UserDoctorCommonModule } from './../common/user-doctor-common/user-doctor-common.module';
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UsersSchema;
          return schema;
        },
      },
    ]),
    forwardRef(() => UserDoctorCommonModule),
    ResponseMapperModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
