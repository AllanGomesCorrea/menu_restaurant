import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { BookingsModule } from './bookings/bookings.module';
import { BlockedSlotsModule } from './blocked-slots/blocked-slots.module';
import { HealthModule } from './health/health.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    BootstrapModule, // Auto-cria admin inicial via variáveis de ambiente
    AuthModule,
    UsersModule,
    MenuModule,
    BookingsModule,
    BlockedSlotsModule,
    QueueModule,
    HealthModule,
  ],
})
export class AppModule {}

