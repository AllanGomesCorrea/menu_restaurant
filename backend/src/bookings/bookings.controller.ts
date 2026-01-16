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
import { Role, BookingStatus, BookingEnvironment } from '@prisma/client';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
  BookingResponseDto,
  BookingListResponseDto,
  AvailabilityResponseDto,
} from './dto';
import { Roles, Public } from '../common/decorators';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Get('availability')
  @ApiOperation({ summary: 'Verificar disponibilidade de horários (público)' })
  @ApiQuery({ name: 'date', required: true, description: 'Data no formato YYYY-MM-DD' })
  @ApiResponse({
    status: 200,
    description: 'Disponibilidade de horários',
    type: AvailabilityResponseDto,
  })
  async checkAvailability(@Query('date') date: string): Promise<AvailabilityResponseDto> {
    return this.bookingsService.checkAvailability(date);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar todas as reservas (autenticado)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrar por data (YYYY-MM-DD)' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'environment', required: false, enum: BookingEnvironment })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas',
    type: BookingListResponseDto,
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('date') date?: string,
    @Query('status') status?: BookingStatus,
    @Query('environment') environment?: BookingEnvironment,
  ): Promise<BookingListResponseDto> {
    return this.bookingsService.findAll({ page, limit, date, status, environment });
  }

  @Get('by-date/:date')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar reservas por data específica' })
  @ApiResponse({
    status: 200,
    description: 'Reservas da data',
    type: [BookingResponseDto],
  })
  async findByDate(@Param('date') date: string): Promise<BookingResponseDto[]> {
    return this.bookingsService.findByDate(date);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Buscar reserva por ID' })
  @ApiResponse({
    status: 200,
    description: 'Dados da reserva',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BookingResponseDto> {
    return this.bookingsService.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Criar nova reserva (público - cliente faz)' })
  @ApiResponse({
    status: 201,
    description: 'Reserva criada com sucesso',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Horário já reservado' })
  async create(@Body() createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    return this.bookingsService.create(createBookingDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar reserva (Supervisor + Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Reserva atualizada com sucesso',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 409, description: 'Horário já reservado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alterar status da reserva (Supervisor + Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Status alterado com sucesso',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remover reserva (apenas Admin)' })
  @ApiResponse({ status: 204, description: 'Reserva removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.bookingsService.remove(id);
  }
}

