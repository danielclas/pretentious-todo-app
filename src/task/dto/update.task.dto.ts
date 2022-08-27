import { PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';
import { CreateTaskDTO } from './create.task.dto';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
