import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment, BookingStatus } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateBookingDto {
  @ApiPropertyOptional({
    description: 'Nome do cliente',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  customerEmail?: string;

  @ApiPropertyOptional({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\(?[1-9]{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, {
    message: 'Telefone inválido',
  })
  customerPhone?: string;

  @ApiPropertyOptional({
    description: 'Data da reserva',
    example: '2024-12-25',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data inválida' })
  date?: string;

  @ApiPropertyOptional({
    description: 'Horário da reserva',
    example: '19:00',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário inválido. Use o formato HH:mm',
  })
  timeSlot?: string;

  @ApiPropertyOptional({
    description: 'Ambiente da reserva',
    enum: BookingEnvironment,
  })
  @IsOptional()
  @IsEnum(BookingEnvironment, { message: 'Ambiente inválido' })
  environment?: BookingEnvironment;

  @ApiPropertyOptional({
    description: 'Número de pessoas',
    example: 4,
  })
  @IsOptional()
  @IsInt({ message: 'Número de pessoas deve ser um inteiro' })
  @Min(1, { message: 'Mínimo de 1 pessoa' })
  @Max(20, { message: 'Máximo de 20 pessoas' })
  guests?: number;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Observações devem ter no máximo 500 caracteres' })
  observations?: string;

  @ApiPropertyOptional({
    description: 'Status da reserva',
    enum: BookingStatus,
  })
  @IsOptional()
  @IsEnum(BookingStatus, { message: 'Status inválido' })
  status?: BookingStatus;
}

export class UpdateBookingStatusDto {
  @ApiPropertyOptional({
    description: 'Status da reserva',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  @IsEnum(BookingStatus, { message: 'Status inválido' })
  status: BookingStatus;
}

