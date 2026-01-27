import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(to: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Добро пожаловать!',
        template: './welcome', // Если добавишь шаблоны позже
        context: { name: 'Друг' },
        text: 'Приветик! Спасибо, что ты с нами.',
      });
      this.logger.log(`Письмо успешно отправлено на ${to}`);
    } catch (error) {
      this.logger.error(`Ошибка при отправке письма на ${to}: ${error.message}`);
    }
  }
}
