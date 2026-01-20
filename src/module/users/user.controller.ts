import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('register')
  postCreateUser(@Body() userCreateDto: UserCreateDto) {
    const result = this.userService.postCreateUser(userCreateDto);
    return result;
  }
}
