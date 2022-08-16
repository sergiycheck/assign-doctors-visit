import { DoctorRes } from './../../doctor/dto/responses.dto';
import { UserRes } from './../../user/dto/responses.dto';
import { OmitType } from '@nestjs/swagger';
import { CommonResponse } from './../../common/common-response';
export class SlotRes extends CommonResponse {
  id: string;
  user?: string | undefined;
  doctor: string;

  slot_date: string;
  free: boolean;
  jobIds?: string[];
}

export class SlotResWithRelations extends OmitType(SlotRes, ['user', 'doctor'] as const) {
  user?: UserRes;
  doctor: DoctorRes;
}
