import { UserRes } from './../../resources/user/dto/responses.dto';
import { SlotRes } from './../../resources/slot/dto/responses.dto';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Response {
  message: string;
  data: {
    updatedSlot: SlotRes;
    updatedUser: UserRes;
  };
}

@Injectable()
export class MessagingBullRedisInterceptor implements NestInterceptor<Response> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response> {
    return next.handle().pipe(
      tap((data: Response) => {
        console.log(data);
      }),
    );
  }
}
