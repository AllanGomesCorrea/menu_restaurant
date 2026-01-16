import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuCategory } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({
    description: 'Nome do prato',
    example: 'Costela Assada 12 Horas',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Descrição do prato',
    example: '12 horas de cozimento lento. Acompanha farofa, vinagrete e arroz',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Preço do prato em reais',
    example: 89.0,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  price: number;

  @ApiProperty({
    description: 'Categoria do prato',
    enum: MenuCategory,
    example: MenuCategory.PRATOS,
  })
  @IsEnum(MenuCategory, { message: 'Categoria inválida' })
  category: MenuCategory;

  @ApiPropertyOptional({
    description: 'Item em destaque',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Item disponível',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({
    description: 'URL da imagem do prato (URL completa ou caminho relativo)',
    example: '/menu-images/costela.jpg',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/.*|\/.*\.(jpg|jpeg|png|gif|webp|svg))$/i, {
    message: 'Imagem inválida. Use uma URL (http://...) ou caminho relativo (/menu-images/...)',
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

