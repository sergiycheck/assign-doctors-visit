import { AssignmentResponse } from './../../common/interceptors/messages-bull-redis.interceptor';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

export const SlotsQueuesNames = {
  assign_doctors_visit_queue: 'assign_doctors_visit_queue',
};

export const QueueJobNames = {
  notification_on_assignment_day_before: 'notification_on_assignment_day_before',
  notification_on_assignment_2_hours_before: 'notification_on_assignment_2_hours_before',
};

export type ReminderJobType = {
  message: {
    data: string;
  };
};

@Injectable()
export class MessagingQueueAssigningSlotsService {
  constructor(
    @InjectQueue(SlotsQueuesNames.assign_doctors_visit_queue)
    private assignDoctorsVisitQueue: Queue,
  ) {}

  async addNotificationsOnAssignment(assignmentResponse: AssignmentResponse) {
    const { data } = assignmentResponse;
    const slotAssignmentDate = new Date(data.updatedSlot.slot_date);

    const millisecondsInHour = 60 * 60 * 1000;
    const millisecondsInOneDay = millisecondsInHour * 24;

    let slotAssignmentNotificationDayBeforeDate = new Date(
      slotAssignmentDate.getTime() - millisecondsInOneDay,
    );

    let slotAssignmentNotificationTwoHoursBeforeDate = new Date(
      slotAssignmentDate.getTime() - millisecondsInHour,
    );

    // TODO: debug it and remove it

    slotAssignmentNotificationDayBeforeDate = new Date(Date.now() - 1000 * 10);
    slotAssignmentNotificationTwoHoursBeforeDate = new Date(Date.now() - 1000 * 2);

    /** const jobDayBefore = */ await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_day_before,
      {
        message: {
          data:
            `${slotAssignmentNotificationDayBeforeDate} | Hello ${data.updatedUser.name}!` +
            `Reminder that you was assigned for ${data.updatedSlot.doctor}` +
            `tomorrow at ${new Date(data.updatedSlot.slot_date)}`,
        },
      },
      {
        delay: slotAssignmentNotificationDayBeforeDate.getTime(),
      },
    );

    /** const jobTwoHoursBefore = */ await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_2_hours_before,
      {
        message: {
          data:
            `${slotAssignmentNotificationDayBeforeDate} | Hello ${data.updatedUser.name}!` +
            `Reminder. You have to visit ${data.updatedSlot.doctor} in 2 hours` +
            `at ${new Date(data.updatedSlot.slot_date)}`,
        },
      },
      {
        delay: slotAssignmentNotificationTwoHoursBeforeDate.getTime(),
      },
    );
  }
}
