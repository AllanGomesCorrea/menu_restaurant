import { ApiProperty } from '@nestjs/swagger';
import { QueueStatus } from '@prisma/client';

export class QueueEntryResponseDto {
  @ApiProperty({ description: 'ID único' })
  id: string;

  @ApiProperty({ description: 'Código único para acompanhamento', example: 'XKM749' })
  code: string;

  @ApiProperty({ description: 'Nome do cliente' })
  name: string;

  @ApiProperty({ description: 'Telefone do cliente' })
  phone: string;

  @ApiProperty({ description: 'Quantidade de pessoas' })
  partySize: number;

  @ApiProperty({ description: 'Status na fila', enum: QueueStatus })
  status: QueueStatus;

  @ApiProperty({ description: 'Posição atual na fila', required: false })
  position?: number;

  @ApiProperty({ description: 'Pessoas à frente', required: false })
  peopleAhead?: number;

  @ApiProperty({ description: 'Quando foi chamado', required: false })
  calledAt?: Date | null;

  @ApiProperty({ description: 'Quando sentou', required: false })
  seatedAt?: Date | null;

  @ApiProperty({ description: 'Data de entrada na fila' })
  createdAt: Date;
}

export class QueuePositionResponseDto {
  @ApiProperty({ description: 'Código único' })
  code: string;

  @ApiProperty({ description: 'Nome do cliente' })
  name: string;

  @ApiProperty({ description: 'Posição atual na fila' })
  position: number;

  @ApiProperty({ description: 'Pessoas à frente' })
  peopleAhead: number;

  @ApiProperty({ description: 'Status atual', enum: QueueStatus })
  status: QueueStatus;

  @ApiProperty({ description: 'Tempo estimado de espera (minutos)', required: false })
  estimatedWaitMinutes?: number;

  @ApiProperty({ description: 'Mensagem de status' })
  message: string;
}

export class QueueStatsDto {
  @ApiProperty({ description: 'Total de pessoas aguardando' })
  waiting: number;

  @ApiProperty({ description: 'Total de pessoas chamadas' })
  called: number;

  @ApiProperty({ description: 'Total de pessoas sentadas hoje' })
  seated: number;

  @ApiProperty({ description: 'Total de no-shows hoje' })
  noShow: number;

  @ApiProperty({ description: 'Total de cancelamentos hoje' })
  cancelled: number;
}

