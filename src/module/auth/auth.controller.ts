import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, UserCreateDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // регистрация
  @ApiCreatedResponse({ description: 'Record created successfully' })
  @ApiOperation({ summary: 'Создание пользователя' })
  @Post('register')
  async register(@Body() body: UserCreateDto) {
    const result = await this.authService.register(body);

    return result;
  }

  // авторизация
  @ApiCreatedResponse({ description: 'user authorization' })
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
