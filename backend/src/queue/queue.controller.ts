import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { CreateQueueEntryDto } from './dto/create-queue-entry.dto';
import {
  QueueEntryResponseDto,
  QueuePositionResponseDto,
  QueueStatsDto,
} from './dto/queue-entry-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Role, QueueStatus } from '@prisma/client';

@ApiTags('Fila Digital')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // ========================================
  // ENDPOINTS PÚBLICOS
  // ========================================

  @Post()
  @Public()
  @ApiOperation({ summary: 'Entrar na fila' })
  @ApiResponse({
    status: 201,
    description: 'Entrada criada com sucesso',
    type: QueueEntryResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já está na fila',
  })
  async create(
    @Body() dto: CreateQueueEntryDto,
  ): Promise<QueueEntryResponseDto> {
    return this.queueService.create(dto);
  }

  @Get('status/:code')
  @Public()
  @ApiOperation({ summary: 'Consultar posição pelo código' })
  @ApiResponse({
    status: 200,
    description: 'Posição na fila',
    type: QueuePositionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Código não encontrado',
  })
  async getStatus(@Param('code') code: string): Promise<QueuePositionResponseDto> {
    return this.queueService.findByCode(code);
  }

  // ========================================
  // ENDPOINTS ADMIN
  // ========================================

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar fila do dia (Admin)' })
  @ApiQuery({ name: 'status', enum: QueueStatus, required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista da fila',
  })
  async findAll(
    @Query('status') status?: QueueStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: QueueEntryResponseDto[]; total: number }> {
    return this.queueService.findAll({
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas do dia (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas',
    type: QueueStatsDto,
  })
  async getStats(): Promise<QueueStatsDto> {
    return this.queueService.getStats();
  }

  @Patch(':id/call')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chamar cliente (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente chamado',
    type: QueueEntryResponseDto,
  })
  async callNext(@Param('id') id: string): Promise<QueueEntryResponseDto> {
    return this.queueService.callNext(id);
  }

  @Patch(':id/seat')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar como sentado (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente sentou',
    type: QueueEntryResponseDto,
  })
  async markSeated(@Param('id') id: string): Promise<QueueEntryResponseDto> {
    return this.queueService.markSeated(id);
  }

  @Patch(':id/no-show')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar como não compareceu (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Cliente não compareceu',
    type: QueueEntryResponseDto,
  })
  async markNoShow(@Param('id') id: string): Promise<QueueEntryResponseDto> {
    return this.queueService.markNoShow(id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar entrada (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Entrada cancelada',
    type: QueueEntryResponseDto,
  })
  async cancel(@Param('id') id: string): Promise<QueueEntryResponseDto> {
    return this.queueService.cancel(id);
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Limpar fila do dia (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Fila limpa',
  })
  async clearQueue(): Promise<{ count: number; message: string }> {
    const result = await this.queueService.clearQueue();
    return {
      ...result,
      message: `${result.count} entrada(s) expirada(s)`,
    };
  }
}

