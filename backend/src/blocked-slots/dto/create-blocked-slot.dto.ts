import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBlockedSlotDto {
  @ApiProperty({
    description: 'Data do bloqueio (formato ISO)',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Data inválida. Use o formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  date: string;

  @ApiProperty({
    description: 'Horário do bloqueio',
    example: '19:00',
  })
  @IsString()
  @IsNotEmpty({ message: 'Horário é obrigatório' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário inválido. Use o formato HH:mm',
  })
  timeSlot: string;

  @ApiPropertyOptional({
    description: 'Ambiente específico (null = ambos ambientes)',
    enum: BookingEnvironment,
    example: BookingEnvironment.INDOOR,
  })
  @IsOptional()
  @IsEnum(BookingEnvironment, { message: 'Ambiente inválido' })
  environment?: BookingEnvironment;

  @ApiPropertyOptional({
    description: 'Motivo do bloqueio',
    example: 'Manutenção no salão',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Motivo deve ter no máximo 200 caracteres' })
  reason?: string;
}

