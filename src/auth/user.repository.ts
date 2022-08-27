import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseErrorCode } from 'src/database/database.error.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(dto: CreateUserDTO) {
    const { username, email, password } = dto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, email, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === DatabaseErrorCode.UNIQUE_VIOLATION) {
        throw new HttpException('Username must be unique', HttpStatus.CONFLICT);
      } else throw new InternalServerErrorException();
    }
  }
}
