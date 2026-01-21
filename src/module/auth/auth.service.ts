import { Injectable, Logger } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { decode, sign, verify } from 'jsonwebtoken';
import { appConfig } from '../../config';
import { UserEntity } from '../../database/entities/user.entity';
import { ConflictException, UnauthorizedException } from '../../exceptions';
import { UserService } from '../users/user.service';
import { JwtPayload, TokenPair } from './auth.types';
import { LoginDto, UserCreateDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly userService: UserService) {}
  // Регистрация пользователя
  async register(dto: UserCreateDto) {
    const userPresence = await this.userService.findOneByEmail(dto.email);

    if (userPresence) {
      this.logger.log(`Пользователь с логином ${dto.email} уже существует`);
      throw new ConflictException(`A user with this login already exists.`);
    }

    // хешируем пароль
    const rounds = 10;
    const rawPassword = dto.password;
    const hashedPassword = await hash(rawPassword, rounds);

    const newUser: UserCreateDto = { ...dto, password: hashedPassword };

    const user = await this.userService.register(newUser as UserCreateDto);

    const { password, ...result } = user.get({ plain: true });
    this.logger.log(`Регистрация нового пользователя ${dto.email}`);

    return result;
  }

  // авторизация по логину и паролю
  async login(dto: LoginDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, active } = user.get({ plain: true });

    const equals = await compare(dto.password, password);
    if (!equals) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!active) {
      throw new UnauthorizedException('You are blocked');
    }
    const tokens = await this.upsertTokenPair(user);

    this.logger.log(`Пользователь найден ${dto.email}`);
    return tokens;
  }

  private async upsertTokenPair(user: UserEntity): Promise<TokenPair> {
    const { id } = user.get({ plain: true });

    const payload: JwtPayload = { id };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }

  public verify(token: string, type: 'access' | 'refresh'): boolean {
    const secrets = {
      access: appConfig.jwt.accessSecret,
      refresh: appConfig.jwt.refreshSecret,
    };

    try {
      verify(token, secrets[type]);
      return true;
    } catch (err) {
      return false;
    }
  }

  public decode(token: string): JwtPayload {
    const decoded = decode(token, { json: true });

    if (!decoded) {
      throw new UnauthorizedException();
    }

    return decoded as JwtPayload;
  }
}
