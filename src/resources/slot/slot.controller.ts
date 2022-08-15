import { CustomParseObjectIdPipe } from './../../common/pipes/custom-parse-objectid.pipe';
import { NotEmptyPipe } from './../../common/pipes/not-empty.pipe';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { AssignSlotForUserDto, CreateSlotForDoctorDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { ApiTags } from '@nestjs/swagger';

import {
  AddNotificationsBullRedisInterceptor,
  RemoveNotificationsBullRedisInterceptor,
} from './../../common/interceptors/messages-bull-redis.interceptor';

@ApiTags('SlotController')
@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('create-free-slot-for-doctor')
  createWithUpdate(@Body() createSlotDto: CreateSlotForDoctorDto) {
    return this.slotService.createFreeSlotForDoctor(createSlotDto);
  }

  @Post('assign-slot-for-user')
  @UseInterceptors(AddNotificationsBullRedisInterceptor)
  async assignSlotForUser(@Body() assignSlotForUserDto: AssignSlotForUserDto) {
    const res = await this.slotService.assignSlotForUser(assignSlotForUserDto);
    return {
      message: `user ${
        res.updatedUser.name
      } has assigned for the doctor's visit at ${new Date(res.updatedSlot.slot_date)}`,
      data: res,
    };
  }

  @Post('discard-slot-for-user')
  @UseInterceptors(RemoveNotificationsBullRedisInterceptor)
  async discardSlotForUser(@Body() assignSlotForUserDto: AssignSlotForUserDto) {
    const res = await this.slotService.discardSlotForUser(assignSlotForUserDto);
    return {
      message: `user ${
        res.updatedUser.name
      } has discarded assignment for the doctor's visit at ${new Date(
        res.updatedSlot.slot_date,
      )}`,
      data: res,
    };
  }

  @Get()
  findAll() {
    return this.slotService.finAllMapped();
  }

  @Get('with-user-and-doctor')
  findAllWithRelations() {
    return this.slotService.findAllWithRelatedEntitiesMapped();
  }

  @Get(':id')
  findOne(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.slotService.findOneMapped(id);
  }

  @Get('with-user-and-doctor/:id')
  findOneWithRelations(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.slotService.findOneWithRelatedEntitiesMapped(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return this.slotService.updateMapped(id, updateSlotDto);
  }

  @Delete(':id')
  remove(@Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string) {
    return this.slotService.remove(id);
  }

  @Delete('remove-with-update/:id')
  removeWithUpdate(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.slotService.removeSlotUpdateEntities(id);
  }
}
