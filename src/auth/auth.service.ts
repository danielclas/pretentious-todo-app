import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';
import { CreateUserDTO } from './dto/create.user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  signUp(dto: CreateUserDTO) {
    return this.userRepository.createUser(dto);
  }

  async signIn(credentials: AuthCredentialsDTO) {
    const { username, password } = credentials;
    const user = await this.userRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const token = this.jwtService.sign(payload);
      return { token };
    } else throw new UnauthorizedException('Bad credentials');
  }
}
