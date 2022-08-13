import { CommonResponse } from './../../common/common-response';
export class UserRes extends CommonResponse {
  id: string;
  name: string;
  phone: string;
  email: string;

  slots: string[];
}
