import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role, BookingEnvironment } from '@prisma/client';
import { BlockedSlotsService } from './blocked-slots.service';
import {
  CreateBlockedSlotDto,
  BlockedSlotResponseDto,
  BlockedSlotListResponseDto,
} from './dto';
import { Roles } from '../common/decorators';

@ApiTags('blocked-slots')
@ApiBearerAuth('JWT-auth')
@Controller('blocked-slots')
export class BlockedSlotsController {
  constructor(private readonly blockedSlotsService: BlockedSlotsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Listar todos os bloqueios' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar por data (YYYY-MM-DD)' })
  @ApiQuery({ name: 'environment', required: false, enum: BookingEnvironment })
  @ApiResponse({
    status: 200,
    description: 'Lista de bloqueios',
    type: BlockedSlotListResponseDto,
  })
  async findAll(
    @Query('date') date?: string,
    @Query('environment') environment?: BookingEnvironment,
  ): Promise<BlockedSlotListResponseDto> {
    return this.blockedSlotsService.findAll({ date, environment });
  }

  @Get('by-date/:date')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Listar bloqueios por data específica' })
  @ApiResponse({
    status: 200,
    description: 'Bloqueios da data',
    type: [BlockedSlotResponseDto],
  })
  async findByDate(@Param('date') date: string): Promise<BlockedSlotResponseDto[]> {
    return this.blockedSlotsService.findByDate(date);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiOperation({ summary: 'Buscar bloqueio por ID' })
  @ApiResponse({
    status: 200,
    description: 'Dados do bloqueio',
    type: BlockedSlotResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Bloqueio não encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BlockedSlotResponseDto> {
    return this.blockedSlotsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Bloquear horário (apenas Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Horário bloqueado com sucesso',
    type: BlockedSlotResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Horário já bloqueado' })
  async create(@Body() createBlockedSlotDto: CreateBlockedSlotDto): Promise<BlockedSlotResponseDto> {
    return this.blockedSlotsService.create(createBlockedSlotDto);
  }

  @Post('block-day')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Bloquear dia inteiro (apenas Admin)' })
  @ApiQuery({ name: 'date', required: true, description: 'Data (YYYY-MM-DD)' })
  @ApiQuery({ name: 'environment', required: false, enum: BookingEnvironment })
  @ApiQuery({ name: 'reason', required: false, description: 'Motivo do bloqueio' })
  @ApiResponse({
    status: 201,
    description: 'Dia bloqueado com sucesso',
    type: [BlockedSlotResponseDto],
  })
  async blockEntireDay(
    @Query('date') date: string,
    @Query('environment') environment?: BookingEnvironment,
    @Query('reason') reason?: string,
  ): Promise<BlockedSlotResponseDto[]> {
    return this.blockedSlotsService.blockEntireDay(date, environment, reason);
  }

  @Delete('unblock-day')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desbloquear dia inteiro (apenas Admin)' })
  @ApiQuery({ name: 'date', required: true, description: 'Data (YYYY-MM-DD)' })
  @ApiQuery({ name: 'environment', required: false, enum: BookingEnvironment })
  @ApiResponse({
    status: 200,
    description: 'Quantidade de bloqueios removidos',
  })
  async unblockEntireDay(
    @Query('date') date: string,
    @Query('environment') environment?: BookingEnvironment,
  ): Promise<{ removed: number }> {
    const count = await this.blockedSlotsService.unblockEntireDay(date, environment);
    return { removed: count };
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover bloqueio (apenas Admin)' })
  @ApiResponse({ status: 204, description: 'Bloqueio removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Bloqueio não encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.blockedSlotsService.remove(id);
  }
}

