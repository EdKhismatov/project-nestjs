import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RedisModule } from '../../cache/redis.module';
import { HistoryEntity } from '../../database/entities/history.entity';
import { RabbitmqModule } from '../../message-broker/rabbitmq.module';
import { EmailModule } from '../mailer/email.module';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, RedisModule, EmailModule, RabbitmqModule, SequelizeModule.forFeature([HistoryEntity])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
