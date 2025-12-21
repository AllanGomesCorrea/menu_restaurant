import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao@casadoporco.com.br',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Nova senha do usuário',
    example: 'NovaSenha@123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
    message: 'Senha deve conter pelo menos uma letra e um número',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Role do usuário',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role inválida' })
  role?: Role;

  @ApiPropertyOptional({
    description: 'Status ativo do usuário',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

