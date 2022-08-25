import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config.validation.schema';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return Promise.resolve({
          type: 'mysql',
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          database: config.get('DB_NAME'),
          synchronize: true,
          autoLoadEntities: true,
        });
      },
    }),
    TaskModule,
    AuthModule,
    HealthModule,
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
