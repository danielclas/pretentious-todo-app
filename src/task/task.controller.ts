import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators/user.decorator';
import { CreateTaskDTO } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() dto: CreateTaskDTO, @User() user) {
    return this.taskService.createTask(dto, user);
  }

  @Get()
  getAllTasks(@User() user) {
    return this.taskService.getAllTasks(user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: number, @User() user) {
    return this.taskService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number, @User() user) {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id')
  updateTaskStatus(
    @Param('id') id: number,
    @Body() dto: UpdateTaskDTO,
    @User() user,
  ) {
    return this.taskService.updateTask(id, dto, user);
  }
}
