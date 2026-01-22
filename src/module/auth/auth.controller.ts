import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/jwt.guard';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';
import { LoginDto, UserCreateDto } from './dto';
import { TokenDto } from './dto/token.dto';

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

  // логаут
  @ApiCreatedResponse({ description: 'RefreshToken deleted ' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() refreshToken: TokenDto) {
    await this.authService.logout(refreshToken.token);
    return true;
  }

  @ApiCreatedResponse({ description: 'RefreshToken deleted ' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  async profile(@Request() req: AuthenticatedRequest) {
    return await this.authService.profile(req.user.id);
  }

  @ApiCreatedResponse({ description: 'New refreshtoken and accesstoken' })
  @ApiResponse({ status: 200, description: 'Успешно созданы refresh и access токен' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() refreshToken: TokenDto) {
    return await this.authService.refresh(refreshToken);
  }
}
