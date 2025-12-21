import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role, MenuCategory } from '@prisma/client';
import { MenuService } from './menu.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemResponseDto,
  MenuListResponseDto,
  MenuByCategoryResponseDto,
} from './dto';
import { Roles, Public } from '../common/decorators';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os itens do cardápio (público)' })
  @ApiQuery({ name: 'category', required: false, enum: MenuCategory })
  @ApiQuery({ name: 'available', required: false, type: Boolean })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens do cardápio',
    type: MenuListResponseDto,
  })
  async findAll(
    @Query('category') category?: MenuCategory,
    @Query('available') available?: boolean,
    @Query('featured') featured?: boolean,
  ): Promise<MenuListResponseDto> {
    return this.menuService.findAll({ category, available, featured });
  }

  @Public()
  @Get('by-category')
  @ApiOperation({ summary: 'Listar itens do cardápio agrupados por categoria (público)' })
  @ApiResponse({
    status: 200,
    description: 'Itens do cardápio agrupados por categoria',
    type: MenuByCategoryResponseDto,
  })
  async findByCategory(): Promise<MenuByCategoryResponseDto> {
    return this.menuService.findByCategory();
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Listar itens em destaque (público)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens em destaque',
    type: [MenuItemResponseDto],
  })
  async findFeatured(): Promise<MenuItemResponseDto[]> {
    return this.menuService.findFeatured();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar item do cardápio por ID (público)' })
  @ApiResponse({
    status: 200,
    description: 'Dados do item',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<MenuItemResponseDto> {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo item do cardápio (apenas Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  async create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItemResponseDto> {
    return this.menuService.create(createMenuItemDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar item do cardápio (Supervisor + Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Item atualizado com sucesso',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    return this.menuService.update(id, updateMenuItemDto);
  }

  @Patch(':id/toggle-availability')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alternar disponibilidade do item (Supervisor + Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidade alterada',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async toggleAvailability(@Param('id', ParseUUIDPipe) id: string): Promise<MenuItemResponseDto> {
    return this.menuService.toggleAvailability(id);
  }

  @Patch(':id/toggle-featured')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alternar destaque do item (Supervisor + Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Destaque alterado',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async toggleFeatured(@Param('id', ParseUUIDPipe) id: string): Promise<MenuItemResponseDto> {
    return this.menuService.toggleFeatured(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover item do cardápio (apenas Admin)' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.remove(id);
  }
}

