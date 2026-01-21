import { UserEntity } from '../../database/entities/user.entity';

export type JwtPayload = {
  id: UserEntity['id'];
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
