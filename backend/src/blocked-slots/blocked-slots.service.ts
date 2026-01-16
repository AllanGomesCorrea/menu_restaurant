import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { BookingEnvironment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlockedSlotDto, BlockedSlotResponseDto } from './dto';

@Injectable()
export class BlockedSlotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    date?: string;
    environment?: BookingEnvironment;
  }): Promise<{ data: BlockedSlotResponseDto[]; total: number }> {
    const { date, environment } = params || {};

    const where: Record<string, unknown> = {};

    if (date) {
      where.date = new Date(date);
    }

    if (environment) {
      where.environment = environment;
    }

    const [blockedSlots, total] = await Promise.all([
      this.prisma.blockedSlot.findMany({
        where,
        orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
      }),
      this.prisma.blockedSlot.count({ where }),
    ]);

    return { data: blockedSlots, total };
  }

  async findOne(id: string): Promise<BlockedSlotResponseDto> {
    const blockedSlot = await this.prisma.blockedSlot.findUnique({
      where: { id },
    });

    if (!blockedSlot) {
      throw new NotFoundException('Bloqueio não encontrado');
    }

    return blockedSlot;
  }

  async create(createBlockedSlotDto: CreateBlockedSlotDto): Promise<BlockedSlotResponseDto> {
    const { date, timeSlot, environment, reason } = createBlockedSlotDto;

    const targetDate = new Date(date);

    // Validar se a data não é no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (targetDate < today) {
      throw new BadRequestException('Não é possível bloquear horários de datas passadas');
    }

    // Verificar se já existe bloqueio para este slot
    const existingBlock = await this.prisma.blockedSlot.findFirst({
      where: {
        date: targetDate,
        timeSlot,
        environment: environment || null,
      },
    });

    if (existingBlock) {
      throw new ConflictException('Este horário já está bloqueado');
    }

    try {
      return await this.prisma.blockedSlot.create({
        data: {
          date: targetDate,
          timeSlot,
          environment: environment || null,
          reason,
        },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('Este horário já está bloqueado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const blockedSlot = await this.prisma.blockedSlot.findUnique({
      where: { id },
    });

    if (!blockedSlot) {
      throw new NotFoundException('Bloqueio não encontrado');
    }

    await this.prisma.blockedSlot.delete({
      where: { id },
    });
  }

  async findByDate(date: string): Promise<BlockedSlotResponseDto[]> {
    return this.prisma.blockedSlot.findMany({
      where: {
        date: new Date(date),
      },
      orderBy: { timeSlot: 'asc' },
    });
  }

  async blockEntireDay(
    date: string,
    environment?: BookingEnvironment,
    reason?: string,
  ): Promise<BlockedSlotResponseDto[]> {
    const targetDate = new Date(date);

    // Validar se a data não é no passado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (targetDate < today) {
      throw new BadRequestException('Não é possível bloquear datas passadas');
    }

    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Gerar todos os horários
    const slots: string[] = [];
    for (let hour = 11; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    if (isWeekend) {
      slots.push('00:00');
    }

    // Criar bloqueios para todos os horários
    const blockedSlots: BlockedSlotResponseDto[] = [];

    for (const timeSlot of slots) {
      try {
        const blocked = await this.prisma.blockedSlot.create({
          data: {
            date: targetDate,
            timeSlot,
            environment: environment || null,
            reason: reason || 'Dia bloqueado',
          },
        });
        blockedSlots.push(blocked);
      } catch {
        // Ignora slots já bloqueados
      }
    }

    return blockedSlots;
  }

  async unblockEntireDay(date: string, environment?: BookingEnvironment): Promise<number> {
    const where: Record<string, unknown> = {
      date: new Date(date),
    };

    if (environment) {
      where.environment = environment;
    }

    const result = await this.prisma.blockedSlot.deleteMany({ where });

    return result.count;
  }
}

