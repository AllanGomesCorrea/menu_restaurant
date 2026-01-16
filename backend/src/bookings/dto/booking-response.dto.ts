import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment, BookingStatus } from '@prisma/client';

export class BookingResponseDto {
  @ApiProperty({ description: 'ID da reserva' })
  id: string;

  @ApiProperty({ description: 'Nome do cliente' })
  customerName: string;

  @ApiProperty({ description: 'Email do cliente' })
  customerEmail: string;

  @ApiProperty({ description: 'Telefone do cliente' })
  customerPhone: string;

  @ApiProperty({ description: 'Data da reserva' })
  date: Date;

  @ApiProperty({ description: 'Horário da reserva' })
  timeSlot: string;

  @ApiProperty({ description: 'Ambiente', enum: BookingEnvironment })
  environment: BookingEnvironment;

  @ApiProperty({ description: 'Número de pessoas' })
  guests: number;

  @ApiPropertyOptional({ description: 'Observações' })
  observations?: string | null;

  @ApiProperty({ description: 'Status', enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class BookingListResponseDto {
  @ApiProperty({ description: 'Lista de reservas', type: [BookingResponseDto] })
  data: BookingResponseDto[];

  @ApiProperty({ description: 'Total de reservas' })
  total: number;

  @ApiPropertyOptional({ description: 'Página atual' })
  page?: number;

  @ApiPropertyOptional({ description: 'Itens por página' })
  limit?: number;
}

export class TimeSlotDto {
  @ApiProperty({ description: 'Horário', example: '19:00' })
  time: string;

  @ApiProperty({ description: 'Disponível no ambiente interno' })
  availableIndoor: boolean;

  @ApiProperty({ description: 'Disponível no ambiente externo' })
  availableOutdoor: boolean;
}

export class AvailabilityResponseDto {
  @ApiProperty({ description: 'Data consultada' })
  date: string;

  @ApiProperty({ description: 'É fim de semana' })
  isWeekend: boolean;

  @ApiProperty({ description: 'Horários disponíveis', type: [TimeSlotDto] })
  timeSlots: TimeSlotDto[];
}

