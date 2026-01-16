import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  customerName: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@email.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  customerEmail: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(11) 99999-9999',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(?[1-9]{2}\)?\s?9?\d{4}[-\s]?\d{4}$/, {
    message: 'Telefone inválido. Use o formato (XX) XXXXX-XXXX',
  })
  customerPhone: string;

  @ApiProperty({
    description: 'Data da reserva (formato ISO)',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Data inválida. Use o formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  date: string;

  @ApiProperty({
    description: 'Horário da reserva',
    example: '19:00',
  })
  @IsString()
  @IsNotEmpty({ message: 'Horário é obrigatório' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário inválido. Use o formato HH:mm',
  })
  timeSlot: string;

  @ApiProperty({
    description: 'Ambiente da reserva',
    enum: BookingEnvironment,
    example: BookingEnvironment.INDOOR,
  })
  @IsEnum(BookingEnvironment, { message: 'Ambiente inválido' })
  environment: BookingEnvironment;

  @ApiProperty({
    description: 'Número de pessoas',
    example: 4,
    minimum: 1,
    maximum: 20,
  })
  @IsInt({ message: 'Número de pessoas deve ser um inteiro' })
  @Min(1, { message: 'Mínimo de 1 pessoa' })
  @Max(20, { message: 'Máximo de 20 pessoas' })
  guests: number;

  @ApiPropertyOptional({
    description: 'Observações adicionais',
    example: 'Aniversário de casamento',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Observações devem ter no máximo 500 caracteres' })
  observations?: string;
}

