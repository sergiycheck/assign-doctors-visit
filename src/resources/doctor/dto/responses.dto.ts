import { CommonResponse } from './../../common/common-response';
export class DoctorRes extends CommonResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  spec: string;

  slots: string[];
}
