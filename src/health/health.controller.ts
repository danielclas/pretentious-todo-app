import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import {} from '@nestjs/typeorm';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly dbHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  healthCheck() {
    return this.healthCheckService.check([
      async () => await this.dbHealthIndicator.pingCheck('database'),
    ]);
  }
}
