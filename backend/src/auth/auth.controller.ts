import { Controller, Post, Get, Patch, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto, ProfileResponseDto, ChangePasswordDto } from './dto';
import { Public, Roles, CurrentUser } from '../common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Roles(Role.ADMIN)
  @Post('register')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Registrar novo usuário (apenas Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 409, description: 'Email já em uso' })
  async register(
    @Body() registerDto: RegisterDto,
    @CurrentUser() user: { role: Role },
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto, user);
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getProfile(@CurrentUser('id') userId: string): Promise<ProfileResponseDto> {
    return this.authService.getProfile(userId);
  }

  @Patch('change-password')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Alterar senha do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Senha atual incorreta ou não autorizado' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.changePassword(userId, changePasswordDto);
  }
}

