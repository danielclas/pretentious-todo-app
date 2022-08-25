import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth.credentials.dto';
import { CreateUserDTO } from './dto/create.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign/up')
  signUp(@Body() dto: CreateUserDTO) {
    return this.authService.signUp(dto);
  }

  @Post('/sign/in')
  signIn(@Body() dto: AuthCredentialsDTO) {
    return this.authService.signIn(dto);
  }
}
