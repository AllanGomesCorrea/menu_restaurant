import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createInitialAdmin();
  }

  private async createInitialAdmin() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    const adminName = this.configService.get<string>('ADMIN_NAME') || 'Administrador';

    // Se não houver variáveis de ambiente, não faz nada
    if (!adminEmail || !adminPassword) {
      this.logger.log('Variáveis ADMIN_EMAIL/ADMIN_PASSWORD não configuradas. Pulando criação automática de admin.');
      return;
    }

    try {
      // Verifica se já existe algum admin no sistema
      const existingAdmin = await this.prisma.user.findFirst({
        where: { role: Role.ADMIN },
      });

      if (existingAdmin) {
        this.logger.log('Admin já existe no sistema. Pulando criação automática.');
        return;
      }

      // Verifica se o email específico já existe
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: adminEmail.toLowerCase() },
      });

      if (existingEmail) {
        this.logger.warn(`Email ${adminEmail} já está em uso. Pulando criação de admin.`);
        return;
      }

      // Cria o admin inicial
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = await this.prisma.user.create({
        data: {
          name: adminName,
          email: adminEmail.toLowerCase(),
          password: hashedPassword,
          role: Role.ADMIN,
          isActive: true,
        },
      });

      this.logger.log(`✅ Admin inicial criado com sucesso!`);
      this.logger.log(`   Nome: ${admin.name}`);
      this.logger.log(`   Email: ${admin.email}`);
      this.logger.log(`   Role: ${admin.role}`);
    } catch (error) {
      this.logger.error('Erro ao criar admin inicial:', error);
    }
  }
}

