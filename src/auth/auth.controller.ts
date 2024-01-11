import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { registerAuthDTO } from './dto/register-auth.dto';
import { loginAuthDto } from './dto/login-auth.dto';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  login(@Body() body: loginAuthDto, @Res() res): Promise<string> {
    return this.authService.signIn(body, res);
  }

  @Post('/signup')
  register(@Body() body: registerAuthDTO, @Res() res): any {
    return this.authService.signUp(body, res);
  }
}
