// Service

import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create.task.dto';
import { UpdateTaskDTO } from './dto/update.task.dto';
import { Task, TaskStatus } from './task.entity';
import { TaskRepository } from './task.repository';
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

const mockRepository = () => ({
  getAllTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('Task service', () => {
  let taskService: TaskService;
  let taskRepository: TaskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        TaskService,
        { provide: TaskRepository, useFactory: mockRepository },
      ],
    }).compile();

    taskService = await module.get<TaskService>(TaskService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTaskById', () => {
    it('calls TaskRepository and returns task with ID', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(1, mockUser);
      expect(result).toBe(mockTask);
    });

    it('calls TaskRepository and throws exception from unfound ID', async () => {
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

      expect(taskService.getTaskById(1, mockUser)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('createTask', () => {
    it('creates a task from CreateTaskDTO', async () => {
      jest
        .spyOn(taskRepository, 'createTask')
        .mockImplementation((dto: CreateTaskDTO, user: User) => {
          return Promise.resolve({
            id: 1,
            title: dto.title,
            description: dto.description,
            status: TaskStatus.OPEN,
            user,
          } as Task);
        });

      const result = await taskService.createTask(mockCreateDto, mockUser);

      expect(result.title).toEqual(mockCreateDto.title);
      expect(result.description).toEqual(mockCreateDto.description);
      expect(result.user).toBe(mockUser);
    });
  });

  describe('deleteTask', () => {
    it('deletes a task with a given ID', async () => {
      jest
        .spyOn(taskRepository, 'delete')
        .mockResolvedValue({ raw: '', affected: 1 });

      jest.spyOn(taskService, 'getTaskById').mockResolvedValue(mockTask);

      const result = await taskService.deleteTask(1, mockUser);

      expect(taskService.getTaskById).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('changes the status of a given task', async () => {
      jest.spyOn(taskService, 'getTaskById').mockResolvedValue(mockTask);
      jest
        .spyOn(taskRepository, 'save')
        .mockImplementation((task: Task) => Promise.resolve(task));

      const result = await taskService.updateTask(1, mockUpdateDto, mockUser);
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });

  describe('getAllTasks', () => {
    it('calls TaskRepository and returns the result', async () => {
      const tasks = [mockTask];

      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks);

      const result = await taskService.getAllTasks(mockUser);

      expect(result).toBe(tasks);
    });
  });

  afterEach(() => jest.restoreAllMocks());
});
