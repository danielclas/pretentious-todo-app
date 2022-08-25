import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';
import { TaskController } from './task.controller';
import { Task, TaskStatus } from './task.entity';
import { TaskService } from './task.service';

const mockUser: User = {
  id: '123',
  email: 'email',
  username: 'user',
  password: 'password',
  tasks: [],
};

const mockTask: Task = {
  id: '123',
  title: 'title',
  description: 'description',
  status: TaskStatus.OPEN,
  user: mockUser,
};

const mockCreateDto: CreateTaskDTO = {
  title: 'title',
  description: 'description',
};

const mockUpdateDto: UpdateTaskDTO = {
  status: TaskStatus.IN_PROGRESS,
};

const mockTaskService = () => ({
  createTask: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
  getAllTasks: jest.fn(),
});

describe('Task controller', () => {
  let taskService: TaskService;
  let taskController: TaskController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: TaskService, useFactory: mockTaskService }],
      controllers: [TaskController],
    }).compile();

    taskService = await module.get<TaskService>(TaskService);
    taskController = await module.get<TaskController>(TaskController);
  });

  describe('createTask', () => {
    it('creates a task', async () => {
      jest
        .spyOn(taskService, 'createTask')
        .mockImplementation((dto: CreateTaskDTO, user: User) => {
          return Promise.resolve({
            user,
            title: dto.title,
            description: dto.description,
            id: '123',
            status: TaskStatus.OPEN,
          });
        });

      const result = await taskController.createTask(mockCreateDto, mockUser);
      expect(result.user).toBe(mockUser);
      expect(result.title).toBe(mockCreateDto.title);
      expect(result.description).toBe(mockCreateDto.description);
    });
  });

  describe('deleteTask', () => {
    it('return object indicating how many rows were affected', async () => {
      jest
        .spyOn(taskService, 'deleteTask')
        .mockImplementation((id: number, user: User) => {
          return Promise.resolve();
        });

      const result = await taskController.deleteTask(1, mockUser);
      expect(result).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('updates a task given an update DTO', async () => {
      jest
        .spyOn(taskService, 'updateTask')
        .mockImplementation((id: number, body: UpdateTaskDTO, user: User) => {
          return Promise.resolve({
            ...mockTask,
            status: body.status,
          });
        });

      const result = await taskController.updateTaskStatus(
        1,
        mockUpdateDto,
        mockUser,
      );
      expect(result.status).toBe(mockUpdateDto.status);
    });
  });

  describe('getAllTasks', () => {
    it('returns all tasks', async () => {
      const tasks = [mockTask];
      jest.spyOn(taskService, 'getAllTasks').mockResolvedValue(tasks);

      const result = await taskController.getAllTasks(null);
      expect(result).toBe(tasks);
    });
  });

  afterEach(() => jest.restoreAllMocks());
});
