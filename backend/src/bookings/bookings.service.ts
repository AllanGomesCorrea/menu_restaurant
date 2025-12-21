import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { BookingEnvironment, BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  BookingResponseDto,
  AvailabilityResponseDto,
  TimeSlotDto,
} from './dto';

@Injectable()
export class BookingsService {
  // Horários de funcionamento
  private readonly weekdaySlots = this.generateTimeSlots(11, 23);
  private readonly weekendSlots = [...this.generateTimeSlots(11, 23), '00:00'];

  constructor(private prisma: PrismaService) {}

  private generateTimeSlots(start: number, end: number): string[] {
    const slots: string[] = [];
    for (let hour = start; hour <= end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    date?: string;
    status?: BookingStatus;
    environment?: BookingEnvironment;
  }): Promise<{ data: BookingResponseDto[]; total: number; page?: number; limit?: number }> {
    const { date, status, environment } = params || {};
    // Garantir que page e limit sejam números válidos
    const page = Number(params?.page) || 1;
    const limit = Number(params?.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (date) {
      where.date = new Date(date);
    }

    if (status) {
      where.status = status;
    }

    if (environment) {
      where.environment = environment;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { data: bookings, total, page, limit };
  }

  async findOne(id: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return booking;
  }

  async checkAvailability(date: string): Promise<AvailabilityResponseDto> {
    // Parsear a data no formato YYYY-MM-DD para evitar problemas de timezone
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month é 0-indexed
    
    // Validar se a data não é no passado
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (targetDate < today) {
      throw new BadRequestException('Não é possível verificar disponibilidade para datas passadas');
    }

    const dayOfWeek = targetDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    let availableSlots = isWeekend ? [...this.weekendSlots] : [...this.weekdaySlots];

    // Se for hoje, filtrar horários que já passaram
    const isToday = targetDate.getTime() === today.getTime();
    if (isToday) {
      const currentHour = now.getHours();
      
      availableSlots = availableSlots.filter((slot) => {
        const slotHour = parseInt(slot.split(':')[0], 10);
        // Para meia-noite (00:00), considerar como 24
        const adjustedSlotHour = slotHour === 0 ? 24 : slotHour;
        // Só filtra horários que já passaram (hora atual ou anterior)
        return adjustedSlotHour > currentHour;
      });
    }

    // Buscar reservas existentes para a data
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        date: targetDate,
        status: { not: BookingStatus.CANCELLED },
      },
      select: {
        timeSlot: true,
        environment: true,
      },
    });

    // Buscar slots bloqueados
    const blockedSlots = await this.prisma.blockedSlot.findMany({
      where: {
        date: targetDate,
      },
      select: {
        timeSlot: true,
        environment: true,
      },
    });

    // Criar mapa de disponibilidade
    const timeSlots: TimeSlotDto[] = availableSlots.map((time) => {
      const indoorBooked = existingBookings.some(
        (b) => b.timeSlot === time && b.environment === BookingEnvironment.INDOOR,
      );
      const outdoorBooked = existingBookings.some(
        (b) => b.timeSlot === time && b.environment === BookingEnvironment.OUTDOOR,
      );

      const indoorBlocked = blockedSlots.some(
        (b) =>
          b.timeSlot === time &&
          (b.environment === BookingEnvironment.INDOOR || b.environment === null),
      );
      const outdoorBlocked = blockedSlots.some(
        (b) =>
          b.timeSlot === time &&
          (b.environment === BookingEnvironment.OUTDOOR || b.environment === null),
      );

      return {
        time,
        availableIndoor: !indoorBooked && !indoorBlocked,
        availableOutdoor: !outdoorBooked && !outdoorBlocked,
      };
    });

    return {
      date,
      isWeekend,
      timeSlots,
    };
  }

  async create(createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    const { date, timeSlot, environment, ...rest } = createBookingDto;

    // Parsear a data no formato YYYY-MM-DD para evitar problemas de timezone
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day); // month é 0-indexed

    // Validar se a data não é no passado
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (targetDate < today) {
      throw new BadRequestException('Não é possível criar reserva para datas passadas');
    }

    // Verificar disponibilidade
    const availability = await this.checkAvailability(date);
    const slot = availability.timeSlots.find((s) => s.time === timeSlot);

    if (!slot) {
      throw new BadRequestException('Horário inválido para esta data');
    }

    const isAvailable =
      environment === BookingEnvironment.INDOOR
        ? slot.availableIndoor
        : slot.availableOutdoor;

    if (!isAvailable) {
      throw new ConflictException('Este horário já está reservado ou bloqueado');
    }

    try {
      // Reserva já é criada como CONFIRMED por padrão
      // O horário fica imediatamente indisponível
      // Se houver problema, admin cancela e horário volta a ficar disponível
      const booking = await this.prisma.booking.create({
        data: {
          ...rest,
          date: targetDate,
          timeSlot,
          environment,
          status: BookingStatus.CONFIRMED,
        },
      });

      return booking;
    } catch (error) {
      // Unique constraint violation
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException('Este horário já está reservado');
      }
      throw error;
    }
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    const { date, timeSlot, environment, ...rest } = updateBookingDto;

    // Se estiver mudando data, horário ou ambiente, verificar disponibilidade
    if (date || timeSlot || environment) {
      const newDate = date ? new Date(date) : booking.date;
      const newTimeSlot = timeSlot || booking.timeSlot;
      const newEnvironment = environment || booking.environment;

      // Validar se a data não é no passado
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (newDate < today) {
        throw new BadRequestException('Não é possível alterar reserva para datas passadas');
      }

      // Verificar se não é a mesma combinação
      const isSameSlot =
        newDate.getTime() === booking.date.getTime() &&
        newTimeSlot === booking.timeSlot &&
        newEnvironment === booking.environment;

      if (!isSameSlot) {
        // Verificar disponibilidade do novo slot
        const existingBooking = await this.prisma.booking.findFirst({
          where: {
            date: newDate,
            timeSlot: newTimeSlot,
            environment: newEnvironment,
            status: { not: BookingStatus.CANCELLED },
            id: { not: id },
          },
        });

        if (existingBooking) {
          throw new ConflictException('Este horário já está reservado');
        }

        // Verificar se não está bloqueado
        const blockedSlot = await this.prisma.blockedSlot.findFirst({
          where: {
            date: newDate,
            timeSlot: newTimeSlot,
            OR: [{ environment: newEnvironment }, { environment: null }],
          },
        });

        if (blockedSlot) {
          throw new ConflictException('Este horário está bloqueado');
        }
      }
    }

    const updateData: Record<string, unknown> = { ...rest };

    if (date) {
      updateData.date = new Date(date);
    }
    if (timeSlot) {
      updateData.timeSlot = timeSlot;
    }
    if (environment) {
      updateData.environment = environment;
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateData,
    });
  }

  async updateStatus(id: string, status: BookingStatus): Promise<BookingResponseDto> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // Se estiver tentando CONFIRMAR uma reserva que estava CANCELADA,
    // verificar se o horário não foi ocupado por outra pessoa
    if (status === BookingStatus.CONFIRMED && booking.status === BookingStatus.CANCELLED) {
      const conflictingBooking = await this.prisma.booking.findFirst({
        where: {
          id: { not: id },
          date: booking.date,
          timeSlot: booking.timeSlot,
          environment: booking.environment,
          status: { not: BookingStatus.CANCELLED },
        },
      });

      if (conflictingBooking) {
        throw new ConflictException(
          'Este horário já foi reservado por outro cliente. ' +
          'O cliente precisará fazer uma nova reserva em outro horário.'
        );
      }

      // Verificar também se o horário não foi bloqueado
      const blockedSlot = await this.prisma.blockedSlot.findFirst({
        where: {
          date: booking.date,
          timeSlot: booking.timeSlot,
          OR: [{ environment: booking.environment }, { environment: null }],
        },
      });

      if (blockedSlot) {
        throw new ConflictException('Este horário foi bloqueado pelo administrador.');
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string): Promise<void> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException('Reserva não encontrada');
    }

    await this.prisma.booking.delete({
      where: { id },
    });
  }

  async findByDate(date: string): Promise<BookingResponseDto[]> {
    return this.prisma.booking.findMany({
      where: {
        date: new Date(date),
        status: { not: BookingStatus.CANCELLED },
      },
      orderBy: { timeSlot: 'asc' },
    });
  }
}

