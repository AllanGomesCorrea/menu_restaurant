import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemResponseDto,
  MenuByCategoryResponseDto,
} from './dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    category?: MenuCategory;
    available?: boolean;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: MenuItemResponseDto[]; total: number; page: number; limit: number }> {
    const { category, available, featured, page = 1, limit = 100 } = params || {};

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (typeof available === 'boolean') {
      where.available = available;
    }

    if (typeof featured === 'boolean') {
      where.featured = featured;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.menuItem.findMany({
        where,
        orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return { data: items, total, page, limit };
  }

  async findByCategory(): Promise<MenuByCategoryResponseDto> {
    const items = await this.prisma.menuItem.findMany({
      where: { available: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });

    return {
      entradas: items.filter((item) => item.category === MenuCategory.ENTRADAS),
      pratos: items.filter((item) => item.category === MenuCategory.PRATOS),
      sobremesas: items.filter((item) => item.category === MenuCategory.SOBREMESAS),
      bebidas: items.filter((item) => item.category === MenuCategory.BEBIDAS),
    };
  }

  async findOne(id: string): Promise<MenuItemResponseDto> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    return item;
  }

  async findFeatured(): Promise<MenuItemResponseDto[]> {
    return this.prisma.menuItem.findMany({
      where: {
        featured: true,
        available: true,
      },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItemResponseDto> {
    return this.prisma.menuItem.create({
      data: {
        name: createMenuItemDto.name,
        description: createMenuItemDto.description,
        price: createMenuItemDto.price,
        category: createMenuItemDto.category,
        featured: createMenuItemDto.featured ?? false,
        available: createMenuItemDto.available ?? true,
        imageUrl: createMenuItemDto.imageUrl,
        sortOrder: createMenuItemDto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItemResponseDto> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
    });
  }

  async remove(id: string): Promise<void> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    await this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async toggleAvailability(id: string): Promise<MenuItemResponseDto> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { available: !item.available },
    });
  }

  async toggleFeatured(id: string): Promise<MenuItemResponseDto> {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Item do cardápio não encontrado');
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: { featured: !item.featured },
    });
  }
}

