import { CustomParseObjectIdPipe } from './../../common/pipes/custom-parse-objectid.pipe';
import { NotEmptyPipe } from './../../common/pipes/not-empty.pipe';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@ApiTags('DoctorController')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorService.createMapped(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorService.finAllMapped();
  }

  @Get('with-slots')
  findAllWithSlots() {
    return this.doctorService.findAllWithSlotsMapped();
  }

  @Get(':id')
  findOne(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.doctorService.findOneMapped(id);
  }

  @Get('with-slots/:id')
  findOneWithSlots(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
  ) {
    return this.doctorService.findOneWithSlotsMapped(id);
  }

  @Patch(':id')
  update(
    @Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateMapped(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id', new NotEmptyPipe('id'), new CustomParseObjectIdPipe()) id: string) {
    return this.doctorService.remove(id);
  }
}
