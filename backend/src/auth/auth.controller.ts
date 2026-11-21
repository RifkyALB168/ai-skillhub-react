import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CredentialsDto } from './credentials.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() credentials: CredentialsDto) {
    return this.auth.register(credentials);
  }

  @Post('login')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  login(@Body() credentials: CredentialsDto) {
    return this.auth.login(credentials);
  }
}
