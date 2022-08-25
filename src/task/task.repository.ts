import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create.task.dto';
import { Task, TaskStatus } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(dto: CreateTaskDTO, user: User) {
    const task = this.create({ ...dto, status: TaskStatus.OPEN, user });
    return this.save(task);
  }
}
