import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment } from '@prisma/client';

export class BlockedSlotResponseDto {
  @ApiProperty({ description: 'ID do bloqueio' })
  id: string;

  @ApiProperty({ description: 'Data do bloqueio' })
  date: Date;

  @ApiProperty({ description: 'Horário do bloqueio' })
  timeSlot: string;

  @ApiPropertyOptional({ description: 'Ambiente específico', enum: BookingEnvironment })
  environment?: BookingEnvironment | null;

  @ApiPropertyOptional({ description: 'Motivo do bloqueio' })
  reason?: string | null;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;
}

export class BlockedSlotListResponseDto {
  @ApiProperty({ description: 'Lista de bloqueios', type: [BlockedSlotResponseDto] })
  data: BlockedSlotResponseDto[];

  @ApiProperty({ description: 'Total de bloqueios' })
  total: number;
}

