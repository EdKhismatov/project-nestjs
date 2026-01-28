import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { HistoryEntity } from '../../database/entities/history.entity';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,

    @InjectModel(HistoryEntity)
    private historyEntity: typeof HistoryEntity,
  ) {}

  @EventPattern('send_welcome_email')
  async handleEmailSending(data: { email: string; url: string }) {
    console.log('Поймали событие из RabbitMQ!', data);
    await this.emailService.sendWelcomeEmail(data.email, data.url);
  }

  @EventPattern('log_auth_attempt') // Название "канала" связи
  async handleAuthLog(@Payload() data: any) {
    try {
      await this.historyEntity.create(data);
    } catch (e) {
      console.error('Ошибка записи лога в RabbitMQ:', e.message);
    }
  }
}
