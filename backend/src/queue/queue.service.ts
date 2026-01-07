import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueStatus } from '@prisma/client';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import {
  QueueEntryResponseDto,
  QueuePositionResponseDto,
  QueueStatsDto,
} from './dto/queue-entry-response.dto';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  /**
   * Gera código alfanumérico único (3 letras + 3 números)
   */
  private generateCode(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Sem I, O (confunde com 1, 0)
    const numbers = '0123456789';

    let code = '';
    for (let i = 0; i < 3; i++) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }
    for (let i = 0; i < 3; i++) {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return code;
  }

  /**
   * Retorna início e fim do dia atual
   */
  private getTodayRange(): { start: Date; end: Date } {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return { start, end };
  }

  /**
   * Calcula posição na fila
   */
  private async calculatePosition(entryId: string): Promise<number> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry || entry.status !== QueueStatus.WAITING) {
      return 0;
    }

    const { start, end } = this.getTodayRange();

    const position = await this.prisma.queueEntry.count({
      where: {
        status: QueueStatus.WAITING,
        createdAt: {
          gte: start,
          lt: end,
        },
        // Contar apenas os que entraram antes
        OR: [
          { createdAt: { lt: entry.createdAt } },
          { createdAt: entry.createdAt, id: { lt: entry.id } },
        ],
      },
    });

    return position + 1; // +1 porque a posição começa em 1
  }

  /**
   * Entrar na fila
   */
  async create(dto: CreateQueueEntryDto): Promise<QueueEntryResponseDto> {
    const { start, end } = this.getTodayRange();

    // Verificar se já está na fila hoje
    const existingEntry = await this.prisma.queueEntry.findFirst({
      where: {
        phone: dto.phone,
        status: QueueStatus.WAITING,
        createdAt: {
          gte: start,
          lt: end,
        },
      },
    });

    if (existingEntry) {
      const position = await this.calculatePosition(existingEntry.id);
      throw new ConflictException({
        message: 'Você já está na fila!',
        code: existingEntry.code,
        position,
      });
    }

    // Gerar código único
    let code: string;
    let attempts = 0;
    do {
      code = this.generateCode();
      const exists = await this.prisma.queueEntry.findUnique({
        where: { code },
      });
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new BadRequestException('Erro ao gerar código. Tente novamente.');
    }

    // Criar entrada na fila
    const entry = await this.prisma.queueEntry.create({
      data: {
        code,
        name: dto.name,
        phone: dto.phone,
        partySize: dto.partySize,
      },
    });

    const position = await this.calculatePosition(entry.id);

    return {
      ...entry,
      position,
      peopleAhead: position - 1,
    };
  }

  /**
   * Buscar posição pelo código
   */
  async findByCode(code: string): Promise<QueuePositionResponseDto> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!entry) {
      throw new NotFoundException('Código não encontrado');
    }

    let position = 0;
    let peopleAhead = 0;
    let message = '';
    let estimatedWaitMinutes: number | undefined;

    switch (entry.status) {
      case QueueStatus.WAITING:
        position = await this.calculatePosition(entry.id);
        peopleAhead = position - 1;
        estimatedWaitMinutes = peopleAhead * 10; // ~10 min por grupo
        message =
          position === 1
            ? 'Você é o próximo! Aguarde ser chamado.'
            : `Você está na posição ${position}. ${peopleAhead} grupo(s) à sua frente.`;
        break;

      case QueueStatus.CALLED:
        message = '🔔 SUA VEZ CHEGOU! Por favor, dirija-se à recepção.';
        break;

      case QueueStatus.SEATED:
        message = 'Você já foi atendido. Bom apetite!';
        break;

      case QueueStatus.CANCELLED:
        message = 'Sua entrada foi cancelada.';
        break;

      case QueueStatus.NO_SHOW:
        message =
          'Você foi chamado mas não compareceu. Entre na fila novamente se desejar.';
        break;

      case QueueStatus.EXPIRED:
        message =
          'Sua entrada expirou (fila do dia anterior). Entre novamente.';
        break;
    }

    return {
      code: entry.code,
      name: entry.name,
      position,
      peopleAhead,
      status: entry.status,
      estimatedWaitMinutes,
      message,
    };
  }

  /**
   * Listar fila (admin)
   */
  async findAll(params?: {
    status?: QueueStatus;
    page?: number;
    limit?: number;
  }): Promise<{ data: QueueEntryResponseDto[]; total: number }> {
    const { status, page = 1, limit = 50 } = params || {};
    const { start, end } = this.getTodayRange();

    const where: Record<string, unknown> = {
      createdAt: {
        gte: start,
        lt: end,
      },
    };

    if (status) {
      where.status = status;
    }

    const [entries, total] = await Promise.all([
      this.prisma.queueEntry.findMany({
        where,
        orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.queueEntry.count({ where }),
    ]);

    // Calcular posições para os que estão aguardando
    const data = await Promise.all(
      entries.map(async (entry) => {
        const position =
          entry.status === QueueStatus.WAITING
            ? await this.calculatePosition(entry.id)
            : 0;

        return {
          ...entry,
          position,
          peopleAhead: position > 0 ? position - 1 : 0,
        };
      }),
    );

    return { data, total };
  }

  /**
   * Estatísticas do dia
   */
  async getStats(): Promise<QueueStatsDto> {
    const { start, end } = this.getTodayRange();

    const [waiting, called, seated, noShow, cancelled] = await Promise.all([
      this.prisma.queueEntry.count({
        where: { status: QueueStatus.WAITING, createdAt: { gte: start, lt: end } },
      }),
      this.prisma.queueEntry.count({
        where: { status: QueueStatus.CALLED, createdAt: { gte: start, lt: end } },
      }),
      this.prisma.queueEntry.count({
        where: { status: QueueStatus.SEATED, createdAt: { gte: start, lt: end } },
      }),
      this.prisma.queueEntry.count({
        where: { status: QueueStatus.NO_SHOW, createdAt: { gte: start, lt: end } },
      }),
      this.prisma.queueEntry.count({
        where: { status: QueueStatus.CANCELLED, createdAt: { gte: start, lt: end } },
      }),
    ]);

    return { waiting, called, seated, noShow, cancelled };
  }

  /**
   * Chamar próximo da fila
   */
  async callNext(id: string): Promise<QueueEntryResponseDto> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entrada não encontrada');
    }

    if (entry.status !== QueueStatus.WAITING) {
      throw new BadRequestException('Esta entrada não está aguardando');
    }

    const updated = await this.prisma.queueEntry.update({
      where: { id },
      data: {
        status: QueueStatus.CALLED,
        calledAt: new Date(),
      },
    });

    return { ...updated, position: 0, peopleAhead: 0 };
  }

  /**
   * Marcar como sentado
   */
  async markSeated(id: string): Promise<QueueEntryResponseDto> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entrada não encontrada');
    }

    if (entry.status !== QueueStatus.CALLED) {
      throw new BadRequestException('Esta entrada não foi chamada ainda');
    }

    const updated = await this.prisma.queueEntry.update({
      where: { id },
      data: {
        status: QueueStatus.SEATED,
        seatedAt: new Date(),
      },
    });

    return { ...updated, position: 0, peopleAhead: 0 };
  }

  /**
   * Marcar como não compareceu
   */
  async markNoShow(id: string): Promise<QueueEntryResponseDto> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entrada não encontrada');
    }

    if (entry.status !== QueueStatus.CALLED) {
      throw new BadRequestException('Esta entrada não foi chamada ainda');
    }

    const updated = await this.prisma.queueEntry.update({
      where: { id },
      data: {
        status: QueueStatus.NO_SHOW,
      },
    });

    return { ...updated, position: 0, peopleAhead: 0 };
  }

  /**
   * Cancelar entrada
   */
  async cancel(id: string): Promise<QueueEntryResponseDto> {
    const entry = await this.prisma.queueEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Entrada não encontrada');
    }

    if (
      entry.status === QueueStatus.SEATED ||
      entry.status === QueueStatus.EXPIRED
    ) {
      throw new BadRequestException('Não é possível cancelar esta entrada');
    }

    const updated = await this.prisma.queueEntry.update({
      where: { id },
      data: {
        status: QueueStatus.CANCELLED,
      },
    });

    return { ...updated, position: 0, peopleAhead: 0 };
  }

  /**
   * Limpar fila do dia (marca como expirado)
   */
  async clearQueue(): Promise<{ count: number }> {
    const { start, end } = this.getTodayRange();

    const result = await this.prisma.queueEntry.updateMany({
      where: {
        status: { in: [QueueStatus.WAITING, QueueStatus.CALLED] },
        createdAt: { gte: start, lt: end },
      },
      data: {
        status: QueueStatus.EXPIRED,
      },
    });

    return { count: result.count };
  }

  /**
   * Reset automático (chamado por cron à meia-noite)
   */
  async autoExpire(): Promise<{ count: number }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await this.prisma.queueEntry.updateMany({
      where: {
        status: { in: [QueueStatus.WAITING, QueueStatus.CALLED] },
        createdAt: { lt: today },
      },
      data: {
        status: QueueStatus.EXPIRED,
      },
    });

    return { count: result.count };
  }
}



