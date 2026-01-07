import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingEnvironment } from '@prisma/client';

export class BlockDayDto {
  @ApiProperty({ description: 'Data a ser bloqueada (YYYY-MM-DD)', example: '2025-01-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Ambiente específico', enum: BookingEnvironment })
  @IsOptional()
  @IsEnum(BookingEnvironment)
  environment?: BookingEnvironment;

  @ApiPropertyOptional({ description: 'Motivo do bloqueio', example: 'Feriado' })
  @IsOptional()
  @IsString()
  reason?: string;
}

