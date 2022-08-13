import { CustomParseObjectIdPipe } from './../../common/pipes/custom-parse-objectid.pipe';
import { NotEmptyPipe } from './../../common/pipes/not-empty.pipe';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SlotService } from './slot.service';
import { AssignSlotForUserDto, CreateSlotForDoctorDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SlotController')
@Controller('slot')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post('create-free-slot-for-doctor')
  createWithUpdate(@Body() createSlotDto: CreateSlotForDoctorDto) {
    return this.slotService.createFreeSlotForDoctor(createSlotDto);
  }

  @Post('assign-slot-for-user')
  assignSlotForUser(@Body() assignSlotForUserDto: AssignSlotForUserDto) {
    return this.slotService.assignSlotForUser(assignSlotForUserDto);
  }

  @Post('discard-slot-for-user')
  discardSlotForUser(@Body() assignSlotForUserDto: AssignSlotForUserDto) {
    return this.slotService.discardSlotForUser(assignSlotForUserDto);
  }

  @Get()
  findAll() {
    return this.slotService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.slotService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return this.slotService.update(id, updateSlotDto);
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
