import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

export interface JobPayload { type: 'create-room' | 'monitor-room'; data: any }

export interface IQueueAdapter {
  add(name: string, payload: JobPayload, opts?: JobsOptions): Promise<void>;
  on(event: 'completed'|'failed', handler: (name: string, payload: JobPayload, result?: any, err?: any)=>void): void;
  close(): Promise<void>;
}

export class InMemoryQueue implements IQueueAdapter {
  private handlers: Array<{event: 'completed'|'failed', handler: (name: string, payload: JobPayload, result?: any, err?: any)=>void}> = [];
  constructor(private processor: (name: string, payload: JobPayload)=>Promise<any>) {}
  async add(name: string, payload: JobPayload): Promise<void> {
    setTimeout(async () => {
      try {
        const result = await this.processor(name, payload);
        this.handlers.filter(h=>h.event==='completed').forEach(h=>h.handler(name, payload, result));
      } catch (err) {
        this.handlers.filter(h=>h.event==='failed').forEach(h=>h.handler(name, payload, undefined, err));
      }
    }, 0);
  }
  on(event: 'completed'|'failed', handler: any) { this.handlers.push({event, handler}); }
  async close() { /* noop */ }
}

export class BullMQAdapter implements IQueueAdapter {
  private queue: Queue<JobPayload>;
  private worker: Worker<JobPayload>;
  private events: QueueEvents;
  private callbacks: Array<{event: 'completed'|'failed', handler: (name: string, payload: JobPayload, result?: any, err?: any)=>void}> = [];
  constructor(name: string, processor: (name: string, payload: JobPayload)=>Promise<any>, redisUrl: string) {
    const connection = new IORedis(redisUrl);
    this.queue = new Queue<JobPayload>(name, { connection });
    this.worker = new Worker<JobPayload>(name, async (job) => processor(job.name, job.data), { connection });
    this.events = new QueueEvents(name, { connection });
    this.worker.on('completed', (job, result) => this.callbacks.filter(c=>c.event==='completed').forEach(c=>c.handler(job.name, job.data, result)));
    this.worker.on('failed', (job, err) => this.callbacks.filter(c=>c.event==='failed').forEach(c=>c.handler(job!.name, job!.data, undefined, err)));
  }
  async add(name: string, payload: JobPayload, opts?: JobsOptions) { await this.queue.add(name, payload, opts); }
  on(event: 'completed'|'failed', handler: any) { this.callbacks.push({event, handler}); }
  async close() { await this.worker.close(); await this.queue.close(); await this.events.close(); }
}
