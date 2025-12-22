import { IsString, IsNotEmpty, IsInt, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQueueEntryDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Telefone do cliente (apenas números)',
    example: '11999998888',
  })
  @IsString()
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve ter 10 ou 11 dígitos (apenas números)',
  })
  phone: string;

  @ApiProperty({
    description: 'Quantidade de pessoas',
    example: 2,
    minimum: 1,
    maximum: 20,
  })
  @IsInt({ message: 'Quantidade de pessoas deve ser um número inteiro' })
  @Min(1, { message: 'Mínimo 1 pessoa' })
  @Max(20, { message: 'Máximo 20 pessoas' })
  partySize: number;
}

