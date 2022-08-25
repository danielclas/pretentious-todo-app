import { IsEmail } from 'class-validator';
import { AuthCredentialsDTO } from './auth.credentials.dto';

export class CreateUserDTO extends AuthCredentialsDTO {
  @IsEmail()
  email: string;
}
