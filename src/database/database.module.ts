import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
  ],
})
export class DatabaseModule {}
