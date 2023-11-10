import { Controller, Inject } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ZeebeWorker, ZeebeJob, ZEEBE_CONNECTION_PROVIDER } from 'nestjs-zeebe';
// import { GetInvoiceCorrectedPeriod } from '../utils/period.utils';
import { ZBClient } from 'zeebe-node';

@Controller('zeebe')
export class ZeebeController {
  constructor(
    @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbc: ZBClient,
  ) {}

//   @ZeebeWorker('zeebe_publish_message')
//   async publishMessage(@Payload() job: ZeebeJob) {
//     const { correlationKey, name, timeToLive, variables, messageId } =
//       job.variables;

//     if (!name) {
//       await job.error('ZB_00004', 'Bad request: name is required');
//       return;
//     }
//     try {
//       await this.zbc.publishMessage({
//         correlationKey,
//         name,
//         timeToLive,
//         variables,
//         messageId,
//       });

//       await job.complete();
//     } catch (error) {
//       return await job.error('zeebe_publish_message error', error);
//     }
//   }

//   @ZeebeWorker('zeebe_publish_start_message')
//   async publishStartMessage(@Payload() job: ZeebeJob) {
//     const { correlationKey, name, timeToLive, variables, messageId } =
//       job.variables;

//     if (!name) {
//       await job.error('ZB_00004', 'Bad request: name is required');
//       return;
//     }
//     try {
//       await this.zbc.publishStartMessage({
//         correlationKey,
//         name,
//         timeToLive,
//         variables,
//         messageId,
//       });

//       await job.complete();
//     } catch (error) {
//       return await job.error('zeebe_publish_start_message error', error);
//     }
//   }

//   @ZeebeWorker('timer_generator')
//   async timer_generator(@Payload() job: ZeebeJob) {
//     const { duration } = job.variables;

//     if (!duration) {
//       return await job.error('ZB_00005', 'Error: duration is required');
//     }
//     try {
//       const timer = 'PT' + Math.floor(Math.random() * 1 + duration) + 'S';
//       return await job.complete({ timer });
//     } catch (error) {
//       return await job.error('timer_generator error', error);
//     }
//   }

//   @ZeebeWorker('time_generator')
//   async time_generator(@Payload() job: ZeebeJob) {
//     const { duration } = job.variables;

//     if (!duration) {
//       return await job.error('ZB_00006', 'Error: duration is required');
//     }

//     const timer = 'PT' + duration + 'S';

//     return await job.complete({ timer });
//   }

//   @ZeebeWorker('invoice_period_fixer')
//   async invoice_period_fixer(@Payload() job: ZeebeJob) {
//     try {
//       const { startPeriod, endPeriod } = job.variables;
//       const { startPeriodISO, endPeriodISO } = GetInvoiceCorrectedPeriod(
//         startPeriod,
//         endPeriod,
//       );

//       return await job.complete({ startPeriodISO, endPeriodISO });
//     } catch (e) {
//       return await job.error('[invoice_period_fixer]', JSON.stringify(e));
//     }
//   }
}

