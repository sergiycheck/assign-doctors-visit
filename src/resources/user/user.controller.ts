import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { NotEmptyPipe } from '../../common/pipes/not-empty.pipe';
import { CustomParseObjectIdPipe } from '../../common/pipes/custom-parse-objectid.pipe';

@ApiTags('UserController')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createMapped(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.finAllMapped();
  }

  @Get('with-slots')
  findAllWithSlots() {
    return this.userService.findAllWithSlotsMapped();
  }

  @Get(':id')
  findOne(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.userService.findOneMapped(id);
  }

  @Get('with-slots/:id')
  findOneWithSlots(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.userService.findOneWithSlotsMapped(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMapped(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string) {
    return this.userService.remove(id);
  }
}
