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
    const { updatedSlot, updatedUser, doctor } = data;
    const slotAssignmentDate = new Date(updatedSlot.slot_date);

    const slotAssignmentNotification_1_DayBeforeDate = new Date(
      slotAssignmentDate.getTime() - this.millisecondsInOneDay,
    );

    const slotAssignmentNotification_2_HoursBeforeDate = new Date(
      slotAssignmentDate.getTime() - this.millisecondsInHour * 2,
    );

    const assignDoctorsVisitQueueDelayDayBefore =
      slotAssignmentNotification_1_DayBeforeDate.getTime() - Date.now();

    const assignDoctorsVisitQueueDelay2HoursBefore =
      slotAssignmentNotification_2_HoursBeforeDate.getTime() - Date.now();

    const oneDayBeforeJobId = `${randomUUID()}-1-day-before-${updatedSlot.id}`;
    await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_day_before,
      {
        message: {
          data:
            `\n` +
            `${slotAssignmentNotification_1_DayBeforeDate} | \n` +
            `Hello ${updatedUser.name}! Reminder that you was assigned for ${doctor.spec} \n` +
            `tomorrow at ${new Date(updatedSlot.slot_date)} \n`,
        },
      },
      {
        delay: assignDoctorsVisitQueueDelayDayBefore,
        jobId: oneDayBeforeJobId,
        removeOnComplete: true,
      },
    );

    const twoHorsBeforeJobId = `${randomUUID()}-2-hours-before-${updatedSlot.id}`;
    await this.assignDoctorsVisitQueue.add(
      QueueJobNames.notification_on_assignment_2_hours_before,
      {
        message: {
          data:
            `\n` +
            `${slotAssignmentNotification_2_HoursBeforeDate} | Hello ${updatedUser.name}! \n` +
            `Reminder. You have to visit ${doctor.spec} in 2 hours \n` +
            `at ${new Date(updatedSlot.slot_date)} \n`,
        },
      },
      {
        delay: assignDoctorsVisitQueueDelay2HoursBefore,
        jobId: twoHorsBeforeJobId,
        removeOnComplete: true,
      },
    );

    await this.slotService.addJobsIdUpdate(updatedSlot.id, [
      oneDayBeforeJobId,
      twoHorsBeforeJobId,
    ]);
  }

  async removeNotificationsForAssignment(assignmentResponse: AssignmentResponse) {
    const { data } = assignmentResponse;
    const { updatedSlot, updatedUser, doctor } = data;

    await this.slotService.removeJobsIdUpdate(updatedSlot.id, updatedSlot.jobIds);

    for (const jobId of updatedSlot.jobIds) {
      if (jobId) {
        const job = await this.assignDoctorsVisitQueue.getJob(jobId);
        if (job) await job.remove();
      }
    }

    await this.assignDoctorsVisitQueue.add(
      QueueJobNames.discard_assignment,
      {
        message: {
          data:
            `\n` +
            `${new Date(Date.now())} | \n` +
            `Hello ${updatedUser.name}! You have successfully discarded assignment \n` +
            `for ${doctor.spec} \n` +
            `at ${new Date(updatedSlot.slot_date)} \n`,
        },
      },
      { removeOnComplete: true },
    );
  }
}
