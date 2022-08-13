import { CommonResponse } from './../../common/common-response';
export class SlotRes extends CommonResponse {
  id: string;
  user?: string | undefined;
  doctor: string;

  slot_date: string;
  free: boolean;
}
