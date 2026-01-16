import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({
    description: 'Data para verificar disponibilidade (formato ISO)',
    example: '2024-12-25',
  })
  @IsDateString({}, { message: 'Data inválida. Use o formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'Data é obrigatória' })
  date: string;
}

