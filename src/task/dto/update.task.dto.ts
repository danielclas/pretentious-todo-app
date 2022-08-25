import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateTaskDTO {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
