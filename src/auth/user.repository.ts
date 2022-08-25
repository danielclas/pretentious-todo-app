import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create.user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username must be unique');
      } else throw new InternalServerErrorException();
    }
  }
}
