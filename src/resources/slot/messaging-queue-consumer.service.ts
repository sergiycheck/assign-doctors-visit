import { CustomLogger } from './../../common/logger/custom-logger.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
  SlotsQueuesNames,
  QueueJobNames,
  ReminderJobType,
} from './messagin-queue.service';

@Processor(SlotsQueuesNames.assign_doctors_visit_queue)
export class MessagingQueueConsumer {
  constructor(public customLogger: CustomLogger) {}

  @Process(QueueJobNames.notification_on_assignment_day_before)
  async handlingJobNotificationOnAssignDayBefore(job: Job<ReminderJobType>) {
    this.customLogger.logToFile(`Handling notification day before. ${job.data.message}`);
  }

  @Process(QueueJobNames.notification_on_assignment_2_hours_before)
  async handlingJobNotificationOnAssignTwoHoursBefore(job: Job<ReminderJobType>) {
    this.customLogger.customLog(
      `Handling notification 2 hours before ${job.data.message}`,
    );
  }
}
