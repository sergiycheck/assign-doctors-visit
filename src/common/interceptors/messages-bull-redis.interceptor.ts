import { DoctorRes } from './../../resources/doctor/dto/responses.dto';
import { MessagingQueueAssigningSlotsService } from './../../resources/slot/messagin-queue.service';
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

export interface AssignmentResponse {
  message: string;
  data: {
    updatedSlot: SlotRes;
    updatedUser: UserRes;
    doctor: Omit<DoctorRes, 'slots'>;
  };
}

@Injectable()
export class AddNotificationsBullRedisInterceptor
  implements NestInterceptor<AssignmentResponse>
{
  constructor(private messagingService: MessagingQueueAssigningSlotsService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<AssignmentResponse> {
    return next.handle().pipe(
      tap((data: AssignmentResponse) => {
        this.messagingService.addNotificationsOnAssignment(data);
      }),
    );
  }
}

@Injectable()
export class RemoveNotificationsBullRedisInterceptor
  implements NestInterceptor<AssignmentResponse>
{
  constructor(private messagingService: MessagingQueueAssigningSlotsService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<AssignmentResponse> {
    return next.handle().pipe(
      tap((data: AssignmentResponse) => {
        this.messagingService.removeNotificationsForAssignment(data);
      }),
    );
  }
}
