import { Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  async postCreateUser(body: UserCreateDto) {
    return body;
  }
}
