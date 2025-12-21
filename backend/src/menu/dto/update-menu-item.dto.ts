import { ApiPropertyOptional } from '@nestjs/swagger';
import { MenuCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateMenuItemDto {
  @ApiPropertyOptional({
    description: 'Nome do prato',
    example: 'Costela Assada 12 Horas',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descrição do prato',
    example: '12 horas de cozimento lento. Acompanha farofa, vinagrete e arroz',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Preço do prato em reais',
    example: 89.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Categoria do prato',
    enum: MenuCategory,
    example: MenuCategory.PRATOS,
  })
  @IsOptional()
  @IsEnum(MenuCategory, { message: 'Categoria inválida' })
  category?: MenuCategory;

  @ApiPropertyOptional({
    description: 'Item em destaque',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Item disponível',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'URL da imagem do prato',
    example: 'https://example.com/costela.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'URL da imagem inválida' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

