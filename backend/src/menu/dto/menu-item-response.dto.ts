import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MenuCategory } from '@prisma/client';

export class MenuItemResponseDto {
  @ApiProperty({ description: 'ID do item' })
  id: string;

  @ApiProperty({ description: 'Nome do prato' })
  name: string;

  @ApiProperty({ description: 'Descrição do prato' })
  description: string;

  @ApiProperty({ description: 'Preço em reais' })
  price: number;

  @ApiProperty({ description: 'Categoria', enum: MenuCategory })
  category: MenuCategory;

  @ApiProperty({ description: 'Item em destaque' })
  featured: boolean;

  @ApiProperty({ description: 'Item disponível' })
  available: boolean;

  @ApiPropertyOptional({ description: 'URL da imagem' })
  imageUrl?: string | null;

  @ApiProperty({ description: 'Ordem de exibição' })
  sortOrder: number;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class MenuListResponseDto {
  @ApiProperty({ description: 'Lista de itens do cardápio', type: [MenuItemResponseDto] })
  data: MenuItemResponseDto[];

  @ApiProperty({ description: 'Total de itens' })
  total: number;
}

export class MenuByCategoryResponseDto {
  @ApiProperty({ description: 'Entradas', type: [MenuItemResponseDto] })
  entradas: MenuItemResponseDto[];

  @ApiProperty({ description: 'Pratos principais', type: [MenuItemResponseDto] })
  pratos: MenuItemResponseDto[];

  @ApiProperty({ description: 'Sobremesas', type: [MenuItemResponseDto] })
  sobremesas: MenuItemResponseDto[];

  @ApiProperty({ description: 'Bebidas', type: [MenuItemResponseDto] })
  bebidas: MenuItemResponseDto[];
}

