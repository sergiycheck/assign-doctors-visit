import { AssignmentResponse } from './../../common/interceptors/messages-bull-redis.interceptor';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import { SlotService } from './slot.service';

export const SlotsQueuesNames = {
  assign_doctors_visit_queue: 'assign_doctors_visit_queue',
};

export const QueueJobNames = {
  notification_on_assignment_day_before: 'notification_on_assignment_day_before',
  notification_on_assignment_2_hours_before: 'notification_on_assignment_2_hours_before',

  discard_assignment: 'discard_assignment',
};

export type ReminderJobType = {
  message: {
    data: string;
  };
};

@Injectable()
export class MessagingQueueAssigningSlotsService {
  millisecondsInHour: number;
  millisecondsInOneDay: number;

  constructor(
    @InjectQueue(SlotsQueuesNames.assign_doctors_visit_queue)
    private assignDoctorsVisitQueue: Queue,
    private slotService: SlotService,
  ) {
    this.millisecondsInHour = 60 * 60 * 1000;
    this.millisecondsInOneDay = this.millisecondsInHour * 24;
  }

  async addNotificationsOnAssignment(assignmentResponse: AssignmentResponse) {
    const { data } = assignmentResponse;
    const { updatedSlot } = data;
    const slotAssignmentDate = new Date(updatedSlot.slot_date);

    const slotAssignmentNotification_1_DayBeforeDate = new Date(
      slotAssignmentDate.getTime() - this.millisecondsInOneDay,
    );

    const slotAssignmentNotification_2_HoursBeforeDate = new Date(
      slotAssignmentDate.getTime() - this.millisecondsInHour * 2,
    );

    // TODO: debug it and remove it

    let assignDoctorsVisitQueueDelayDayBefore =
      slotAssignmentNotification_1_DayBeforeDate.getTime() - Date.now();

    let assignDoctorsVisitQueueDelay2HoursBefore =
      slotAssignmentNotification_2_HoursBeforeDate.getTime() - Date.now();

    assignDoctorsVisitQueueDelayDayBefore = 2000;
    assignDoctorsVisitQueueDelay2HoursBefore = 5000;

    const oneDayBeforeJobId = `${randomUUID()}-1-day-before-${updatedSlot.id}`;
    /* const jobOneDayBefore = */ await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_day_before,
      {
        message: {
          data:
            `|\n` +
            `${slotAssignmentNotification_1_DayBeforeDate} | \n` +
            `Hello ${data.updatedUser.name}! Reminder that you was assigned for ${data.updatedSlot.doctor} \n` +
            `tomorrow at ${new Date(data.updatedSlot.slot_date)} \n`,
        },
      },
      {
        delay: assignDoctorsVisitQueueDelayDayBefore,
        jobId: oneDayBeforeJobId,
      },
    );

    const twoHorsBeforeJobId = `${randomUUID()}-2-hours-before-${updatedSlot.id}`;
    /* const jobTwoHoursBefore = */ await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_2_hours_before,
      {
        message: {
          data:
            `|\n` +
            `${slotAssignmentNotification_2_HoursBeforeDate} | Hello ${data.updatedUser.name}! \n` +
            `Reminder. You have to visit ${data.updatedSlot.doctor} in 2 hours \n` +
            `at ${new Date(data.updatedSlot.slot_date)} \n`,
        },
      },
      {
        delay: assignDoctorsVisitQueueDelay2HoursBefore,
        jobId: twoHorsBeforeJobId,
      },
    );

    await this.slotService.addJobsIdUpdate(updatedSlot.id, [
      oneDayBeforeJobId,
      twoHorsBeforeJobId,
    ]);
  }

  async removeNotificationsForAssignment(assignmentResponse: AssignmentResponse) {
    const { data } = assignmentResponse;
    const { updatedSlot } = data;

    await this.slotService.removeJobsIdUpdate(updatedSlot.id, updatedSlot.jobIds);

    for (const jobId of updatedSlot.jobIds) {
      if (jobId) {
        const job = await this.assignDoctorsVisitQueue.getJob(jobId);
        await job.remove();
      }
    }

    await this.assignDoctorsVisitQueue.add(QueueJobNames.discard_assignment, {
      message: {
        data:
          `|\n` +
          `${new Date(Date.now())} | \n` +
          `Hello ${data.updatedUser.name}! You have successfully discarded assignment \n` +
          `for ${data.updatedSlot.doctor} \n` +
          `at ${new Date(updatedSlot.slot_date)} \n`,
      },
    });
  }
}
