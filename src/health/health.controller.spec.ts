import { PassportModule } from '@nestjs/passport';
import {
  HealthCheckResult,
  HealthCheckService,
  TerminusModule,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [TerminusModule, PassportModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(healthCheckService).toBeDefined();
  });

  it('should return status ok', async () => {
    const mockResponse = {
      status: 'ok',
      info: {
        database: {
          status: 'ok',
        },
      },
      error: {},
      details: {
        database: {
          status: 'ok',
        },
      },
    };

    jest.spyOn(healthCheckService, 'check').mockImplementation(() => {
      return Promise.resolve(mockResponse as any as HealthCheckResult);
    });

    const result = await controller.healthCheck();
    expect(result).toBe(mockResponse);
  });
});
