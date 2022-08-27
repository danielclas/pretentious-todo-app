import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  createTask(dto: CreateTaskDTO, user: User) {
    return this.taskRepository.createTask(dto, user);
  }

  async getTaskById(id: number, user: User) {
    const task = await this.taskRepository.findOne({ id, user });

    if (!task) {
      throw new HttpException(
        `Task with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return task;
  }

  getAllTasks(user: User) {
    return this.taskRepository.find({ user });
  }

  async deleteTask(id: number, user: User) {
    const task = await this.getTaskById(id, user);
    const result = await this.taskRepository.delete(task);

    if (result.affected !== 1) throw new InternalServerErrorException();
  }

  async updateTask(id: number, dto: UpdateTaskDTO, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = dto.status;
    return this.taskRepository.save(task);
  }
}
