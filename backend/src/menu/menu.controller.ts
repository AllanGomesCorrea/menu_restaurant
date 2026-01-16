import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Role, MenuCategory } from '@prisma/client';
import { MenuService } from './menu.service';
import {
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuItemResponseDto,
  MenuListResponseDto,
} from './dto';
import { Roles, Public } from '../common/decorators';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('images')
  @ApiOperation({ summary: 'Listar imagens disponíveis na pasta menu-images' })
  @ApiResponse({
    status: 200,
    description: 'Lista de URLs de imagens disponíveis',
  })
  getAvailableImages(): { images: string[] } {
    // Caminho para a pasta de imagens do menu no frontend
    // Resolve a partir da raiz do projeto (backend está em /backend)
    const possiblePaths = [
      path.resolve(process.cwd(), '../public/menu-images'),  // Quando rodando de /backend
      path.resolve(process.cwd(), 'public/menu-images'),     // Quando rodando da raiz
      path.resolve(__dirname, '../../../public/menu-images'), // Fallback
    ];
    
    let menuImagesPath = '';
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        menuImagesPath = p;
        break;
      }
    }
    
    if (!menuImagesPath) {
      console.log('Pasta menu-images não encontrada. Caminhos tentados:', possiblePaths);
      return { images: [] };
    }
    
    try {
      const files = fs.readdirSync(menuImagesPath);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      
      // Em desenvolvimento, usa URL do frontend principal (5173)
      // Em produção, usa caminho relativo
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? '' 
        : 'http://localhost:5173';
      
      const images = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        })
        .map(file => `${baseUrl}/menu-images/${file}`);
      
      console.log(`Encontradas ${images.length} imagens em ${menuImagesPath}`);
      return { images };
    } catch (error) {
      console.error('Erro ao listar imagens:', error);
      return { images: [] };
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos os itens do cardápio (público)' })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: MenuCategory,
    description: 'Filtrar por categoria',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    type: Boolean,
    description: 'Filtrar apenas destaques',
  })
  @ApiQuery({
    name: 'available',
    required: false,
    type: Boolean,
    description: 'Filtrar apenas disponíveis',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de itens do cardápio',
    type: MenuListResponseDto,
  })
  async findAll(
    @Query('category') category?: MenuCategory,
    @Query('featured') featured?: string,
    @Query('available') available?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<MenuListResponseDto> {
    return this.menuService.findAll({
      category,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      available: available === 'true' ? true : available === 'false' ? false : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Listar categorias com seus itens' })
  @ApiResponse({
    status: 200,
    description: 'Cardápio agrupado por categoria',
  })
  async findByCategories() {
    return this.menuService.findByCategory();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar item por ID' })
  @ApiResponse({
    status: 200,
    description: 'Item encontrado',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MenuItemResponseDto> {
    return this.menuService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar novo item no cardápio (apenas Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Item criado com sucesso',
    type: MenuItemResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(
    @Body() createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItemResponseDto> {
    return this.menuService.create(createMenuItemDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar item do cardápio' })
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

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover item do cardápio (apenas Admin)' })
  @ApiResponse({ status: 204, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menuService.remove(id);
  }
}
